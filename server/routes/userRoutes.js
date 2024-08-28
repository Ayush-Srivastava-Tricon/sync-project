const express = require('express');
const router = express.Router();
const connection = require("../config/db.js");
const jwt = require("jsonwebtoken");
const jwttoken = require("../server.js");

const { validateAdminToken } = require("../middleware/middleware.js");

// ***********USER SIGNUP**********

// router.post('/signup', async (req, res) => {
//     const { name, email, password } = req.body;

//     try {
//         if (name && email && password) {
//             const sql = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`;
//             const values = [name,email,password];

//             connection.query(sql, values,(err, result) => {
//                 if (err) throw err;
//                 res.status(200).send({ message: "User Created" });
//             });
//         }
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// });


// *********USER LOGIN**********

router.post('/login', (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sql = 'SELECT email, password, role FROM user WHERE email = ?';
  const values = [email];

  let accessToken, refreshToken;

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Error checking user' });
    }

    let userExists = false;
    for (let i = 0; i < results.length; i++) {
      if (results[i].password === password) {

        userExists = true;
        if (results[i].role == 'admin') {
          accessToken = jwt.sign({ user: results[i] }, jwttoken.adminsecretkey, { expiresIn: '1h' });
          refreshToken = jwt.sign({ user: results[i] }, jwttoken.adminsecretkey, { expiresIn: '24h' });
        } else if (results[i].role == 'booking_engine') {
          accessToken = jwt.sign({ user: results[i] }, jwttoken.bingtripToken, { expiresIn: '1h' });
          refreshToken = jwt.sign({ user: results[i] }, jwttoken.bingtripToken, { expiresIn: '24h' });
        } else {
          accessToken = jwt.sign({ user: results[i] }, jwttoken.usersecretkey, { expiresIn: '1h' });
          refreshToken = jwt.sign({ user: results[i] }, jwttoken.usersecretkey, { expiresIn: '24h' });
        }
        break;
      }
    }

    if (userExists) {
      res.json({ success: true, message: 'Login successful', data: { token: accessToken, refreshToken, role: results[0].role } });
    } else {
      res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// *********Add User**********

router.post('/add_user', validateAdminToken, async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (name && email && password && role) {
      const sql = `INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)`;
      const values = [name, email, password, role];

      connection.query(sql, values, (err, result) => {
        if (!err) {
          res.status(200).send({ message: "User Created", status: 200 });
        } else {
          res.status(400).send({ message: err.sqlMessage, status: 400 });
        }

      });
    } else {
      res.status(400).send({ message: "All fields are required", status: 400 });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// *********Fetch User**********

router.get('/get_user_list', validateAdminToken, async (req, res) => {
  try {
    const sql = `SELECT * FROM user WHERE role != 'admin'  `;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.status(200).send({ message: "Success", status: 200, data: result });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
// *********Edit User**********

router.post('/edit_user', validateAdminToken, async (req, res) => {
  const { name, email, password, id } = req.body;

  try {
    const sql = `UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?`;
    const values = [name, email, password, id];
    connection.query(sql, values, (err, result) => {
      if (!err) {
        res.status(200).send({ message: "Details Updated", status: 200 });
      } else {
        res.status(400).send({ message: err.sqlMessage, status: 400 });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
// *********Delete User**********

router.post('/delete_user', validateAdminToken, async (req, res) => {
  const { id } = req.body;

  try {
    if (id) {
      const sql = `DELETE FROM user WHERE id = ? `;
      const values = [id];
      connection.query(sql, values, (err, result) => {
        if (!err) {
          res.status(200).send({ message: "User Deleted", status: 200 });
        } else {
          res.status(400).send({ message: err.sqlMessage, status: 400 });
        }
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post("/refreshToken", async (req, res) => {
  const { refreshToken, role } = req.body;
  let accessToken, refresh_token, decoded;
  try {
    if (role == 'admin') {
      decoded = jwt.verify(refreshToken, jwttoken.adminsecretkey);
      accessToken = jwt.sign({ user: decoded.user }, jwttoken.adminsecretkey, { expiresIn: '1h' });
      refresh_token = jwt.sign({ user: decoded.user }, jwttoken.adminsecretkey, { expiresIn: '24h' });
    } else if (role == 'booking_engine') {
      decoded = jwt.verify(refreshToken, jwttoken.bingtripToken);
      accessToken = jwt.sign({ user: decoded.user }, jwttoken.bingtripToken, { expiresIn: '1h' });
      refresh_token = jwt.sign({ user: decoded.user }, jwttoken.bingtripToken, { expiresIn: '24h' });
    } else {
      decoded = jwt.verify(refreshToken, jwttoken.usersecretkey);
      accessToken = jwt.sign({ user: decoded.user }, jwttoken.usersecretkey, { expiresIn: '1h' });
      refresh_token = jwt.sign({ user: decoded.user }, jwttoken.usersecretkey, { expiresIn: '24h' });
    }

    res.send({ status: 200, message: "Success", data: { token: accessToken, refreshToken: refresh_token, role: decoded.user.role } });
  } catch (err) {

    res.status(400).send({ message: 'Something went wrong', error: err.message });

  }
})

module.exports = router;
