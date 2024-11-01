const express = require('express');
const router = express.Router();
const connection = require("../config/db.js");
const { default: axios } = require('axios');


router.get('/country',async (req,res)=>{
    let url = 'https://www.e2xinfotech.com/hotelapi/country';
    axios.get(url).then((result)=>{
        res.send(result.data)
    })
})

module.exports = router 