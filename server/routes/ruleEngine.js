const express = require('express');
const router = express.Router();
const connection = require("../config/db.js");
const { default: axios } = require('axios');


router.get('/country', async (req, res) => {
    let url = 'https://www.e2xinfotech.com/hotelapi/country';
    axios.get(url).then((result) => {
        res.send(result.data)
    })
})


router.get("/fethchrule_engine", (req, res) => {
    let query = "SELECT * FROM rule_engines";
    connection.query(query, (error, result) => {
        if (error) throw error;
        res.send(result);
    })
})


router.post("/setrule_engine", (req, res) => {
    const { margin, territory, selling_period, travel_period, excluding_selling_partner, cancellation_policy, payment_policy, hotels_content, hotel_partner_allocation, id } = req.body;

    const query = `
        UPDATE rule_engines 
        SET 
            margin = ?, 
            territory = ?, 
            selling_period = ?, 
            travel_period = ?, 
            excluding_selling_partner = ?, 
            cancellation_policy = ?, 
            payment_policy = ?, 
            hotels_content = ?, 
            hotel_partner_allocation = ?
        WHERE id = ?
    `;

    connection.query(query, [margin, territory, selling_period, travel_period, excluding_selling_partner, cancellation_policy, payment_policy, hotels_content, hotel_partner_allocation, id], (err, result) => {
        if (err) {
            res.send({ status: 500, message: err.message });
        } else if (result.affectedRows === 0) {
            res.send({ status: 404, message: "Record not found" });
        } else {
            res.send({ status: 200, message: "Data Updated Successfully" });
        }
    });
});


// app.put("/updatedata", (req, res) => {
//     let margin = req.body.margin;
//     let territory = req.body.name;
//     let selling_period = req.body.email;
//     let travel_period = req.body.password;
//     let excluding_selling_partner = req.body.excluding_selling_partner;
//     let cancellation_policy = req.body.cancellation_policy;
//     let payment_policy = req.body.payment_policy;
//     let hotels_content = req.body.hotels_content;
//     let hotel_partner_allocation = req.body.hotel_partner_allocation;
//     let id = req.body.id;




//     let sql = "UPDATE rule_engines SET margin = ?, territory = ?, selling_period = ? , travel_period = ?, excluding_selling_partner = ?, cancellation_policy = ?, payment_policy = ?, hotels_content = ?, hotel_partner_allocation = ?  WHERE id = ? ";


//     con.query(sql, [margin, territory, selling_period, travel_period, excluding_selling_partner, cancellation_policy, payment_policy, hotels_content, hotel_partner_allocation, id], (error, result) => {
//         if (!error) {
//             res.send({ message: "student updated successfully !, Please Login", status: 200 });
//         }
//         else {
//             res.send({ message: "Fields are Empty", status: 400, data: error })
//         }
//     });
// });

module.exports = router 