const express = require('express');
const router = express.Router();
const connection = require("../config/db.js");

// *********GET USER's LIST FROM DB*********

router.get('/getUsers', async (req, res) => {

    try {
        const sql = `SELECT * FROM user`;
        connection.query(sql, (err, result) => {
            if (err) throw err;
            res.status(200).send({ message: "Data Found", data: result })
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

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
  
    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Error checking user' });
      }
  
      let userExists = false;
      for (let i = 0; i < results.length; i++) {
        if (results[i].password === password) {
          userExists = true;
          break;
        }
      }
  
      if (userExists) {
        res.json({ success: true, message: 'Login successful', role: results[0].role});
      } else {
        res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
    });
  });

  // *********Add User**********

 router.post('/add_user', async (req, res) => {
    const { name, email, password,role } = req.body;

    try {
        if (name && email && password) {
            const sql = `INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)`;
            const values = [name,email,password,role];

            connection.query(sql, values,(err, result) => {
              if(!err){
                res.status(200).send({ message: "User Created",status:200 });
              }else{
                res.status(400).send({ message: err.sqlMessage,status:400 });
              }
               
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

  // *********Fetch User**********

 router.get('/get_user_list', async (req, res) => {
    try {
            const sql = `SELECT * FROM user WHERE role = 'user' `;
            connection.query(sql,(err, result) => {
                if (err) throw err;
                res.status(200).send({ message: "Success",status:200,data:result});
            });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
  // *********Edit User**********

 router.post('/edit_user', async (req, res) => {
    const { name, email, password ,id } = req.body;

    try {
            const sql = `UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?`;
            const values = [name, email, password, id];
            connection.query(sql, values,(err, result) => {
              if(!err){
                res.status(200).send({ message: "Details Updated",status:200 });
              }else{
                res.status(400).send({ message: err.sqlMessage,status:400 });
              }
            });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
  // *********Delete User**********

 router.post('/delete_user', async (req, res) => {
    const { id } = req.body;

    try {
        if (id) {
            const sql = `DELETE FROM user WHERE id = ? `;
            const values = [id];
            connection.query(sql, values,(err, result) => {
              if(!err){
                res.status(200).send({ message: "User Deleted",status:200 });
              }else{
                res.status(400).send({ message: err.sqlMessage,status:400 });
              }
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
 


module.exports = router;
