const express = require('express');
const router = express.Router();
const connection = require("../config/db.js");

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

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (name && email && password) {
            const sql = `INSERT INTO user (name, email, password) VALUES ('${name}', '${email}', '${password}')`;
            connection.query(sql, (err, result) => {
                if (err) throw err;
                res.status(200).send({ message: "User Created" })
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
  
    const sql = 'SELECT email, password FROM user WHERE email = ?';
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
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
    });
  });


module.exports = router;
