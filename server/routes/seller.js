const express = require('express');
const router = express.Router();
const connection = require("../config/db.js");
const { default: axios } = require('axios');

router.get("/getSellers",(req,res)=>{
    let query = "SELECT * FROM seller";
    connection.query(query,(error, result)=>{
        if(error){
            console.log(error);
            res.send({status:500, message:error.message});
        }else{
            
            let parsedData = result.map((e)=>{
                return{
                    ...e,
                    ip_address: e.ip_address ? JSON.parse(e.ip_address) : ''
                }
            })
            res.send({status:200, data:parsedData})
        }
    })
})

router.post('/saveSeller', (req, res) => {
    const { name, user_name, password, website, ip_address, status } = req.body;
  
    // Insert data into MySQL
    const query = 'INSERT INTO seller (name, user_name, password, website, ip_address, status) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [name, user_name, password, website, JSON.stringify(ip_address), status], (err, result) => {
      if (err){
        console.log(err)
        res.send({status:500, message:err.message})
      }else{
        res.send({status:200, message:"Data Inserted Succesfully"})
      }
      });
    });

module.exports = router;