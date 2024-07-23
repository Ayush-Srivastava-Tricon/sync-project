const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/getUsers', async (req, res) => {

    try {
        let user = await User.find({});
        if (user) {
            return res.status(400).json({ data: user, msg: 'Data Found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (username && email && password) {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            user = new User({
                username,
                email,
                password
            });

            await user.save();

            res.send({message:'User Registered'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(email && password){
        try {
            let user = await User.findOne({ email });
            console.log(user);
            if (user) {
                if (user.email == email && user.password == password) {
                    return res.status(200).json({ msg: 'Login Success', data: user });
                }
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
    res.status(500).send('Server error');

});


module.exports = router;
