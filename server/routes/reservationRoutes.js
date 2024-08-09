const express = require('express');
const router = express.Router();
const axios = require("axios");
const connection = require("../config/db.js");


router.post("/check_hotel_availability", async (req, res) => {
    const { check_in, check_out, occupancy } = req.body;

    const diffInMs = new Date(check_out) - new Date(check_in);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    const query = `
        SELECT h.property_id AS hotelId, h.name, r.room_id AS roomId, r.name AS roomName, c.available AS availability, ra.rate_id as rateId,
        h.currency_code AS currencyCode,
        ra.rate_plan_id AS ratePlanId, ra.allotment, c.rate, c.min, c.max, c.stop_sale AS stopSale FROM properties h
        JOIN rooms r ON h.property_id = r.property_id
        JOIN rates ra ON r.room_id = ra.room_id
        JOIN calendar c ON r.room_id = c.room_id
        WHERE c.start_date BETWEEN ? AND ?
        AND c.available >= ?
        `;

    const values = [check_in, check_out, occupancy.rooms];

    connection.query(query, values, (err, results) => {
        if (!err) {
            const hotels = {};
        const minAllotments = {};
        const minRooms = {};  

        
        results.forEach(row => {
            const key = `${row.hotelId}_${row.roomId}`;
            
            if (!minAllotments[key] || row.availability < minAllotments[key]) {
                minAllotments[key] = row.availability;
                minRooms[key] = row;  
            }
        });
        

        Object.values(minRooms).forEach(row => {
            if ((diffInDays >= row.min && diffInDays <= row.max) && (row.stopSale == '0' || row.stopSale == 0) ) {
                if (!hotels[row.hotelId]) {
                    hotels[row.hotelId] = {
                        hotelId: row.hotelId,
                        name: row.name,
                        rooms: []
                    };
                }

                const room = {
                    roomId: row.roomId,
                    name: row.roomName,
                    rates: [
                        {
                            rateId:row.rateId,
                            ratePlanId: row.ratePlanId,
                            availability: row.availability,
                            price: row.rate * diffInDays,
                            currency:row.currencyCode
                        }
                    ]
                };

                hotels[row.hotelId].rooms.push(room);
                console.log(row);
            }
        });



            const response = {
                msg: "Success",
                code: 10000,
                data: {
                    check_in,
                    check_out,
                    currency: 'USD',
                    hotels: Object.values(hotels)
                }
            };

            res.status(200).send(response);
        } else {


            res.status(400).send({ message: err, status: 400 });
        }
    })

});

router.post("/booking_availability", async (req, response) => {

    const { checkIn, checkOut, occupancy, hotelId, roomId, currency, rateId } = req.body;


    const url = `https://api.opengds.com/core/v1/acc-status/calendar?apikey=oyn0qruhvmxckh24untseew33yt4f37jbjy535t5&rate_id=${rateId}&accom_id=${roomId}&occupancy=${occupancy.adults}&from=${checkIn}&till=${checkOut}`;

    const result = await axios.get(url);



   
            if (result.length === 0) {
                return res.status(404).json({ msg: 'No availability found', code: 10002 });
            }

            result.data.forEach(item => {
                const query = `UPDATE calendar SET rate = ?, min = ?, max = ?, available = ? WHERE start_date = ? AND property_id = ? AND room_id = ?`;
                const values = [item.rate, item.minlos, item.maxlos,item.available ? item.available : 1, item.date, hotelId, roomId];
            
                 connection.query(query, values, (err, results) => {
                  if (err) {
                    console.error('Error updating record:', err);
                  } else {
                    // console.log('Record updated:', results.affectedRows);
                  }
                });
              });

              const getHotelQuery = `SELECT properties.name as hotelName, properties.property_id as hotelId, rooms.name AS roomName from properties JOIN rooms ON properties.property_id = rooms.property_id WHERE properties.property_id = ${hotelId} AND rooms.room_id = ${roomId}`;
              const hotels = {};

              connection.query(getHotelQuery,(err,res)=>{
                if(!err){
                    hotels['name'] = res[0].hotelName;
                    hotels['hotelId'] = res[0].hotelId,
                    hotels['room']=[
                        {
                            roomId,
                            name:res[0].roomName,
                            rates:[{
                                availability:result.data[0].available,
                                price: result.data.length * result.data[0].rate
                            }]
                        }
                    ];

                    const output = {
                        msg: "Success",
                        code: 10000,
                        data: {
                            checkIn,
                            checkOut,
                            currency,
                            hotel: hotels
                        }
                    };

                    response.json(output);
                  
                }else{
                    console.log(err);
                    response.json(err);
                }
            });
});


router.post("/create_bookings",async (req,res)=>{
    const {
        bookingRefId,
        checkIn,
        checkOut,
        hotelId,
        roomId,
        quantity,
        currency,
        totalPrice,
        specialRequests,
        guests,
        contact,
        guestCount,
        ratePlanId
    } = req.body;

    const sql = `
        INSERT INTO bookings (
            bookingRefId, checkIn, checkOut, hotelId, roomId,
            quantity, currency, totalPrice, specialRequests, guests, contact, guestCount,
            ratePlanId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        bookingRefId,
        checkIn,
        checkOut,
        hotelId,
        roomId,
        quantity,
        currency,
        totalPrice,
        specialRequests,
        JSON.stringify(guests),  
        JSON.stringify(contact),
        JSON.stringify(guestCount),
        ratePlanId
    ];


    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ message:err.sqlMessage });
            return;
        }
        res.status(200).json({
            msg: 'Success',
            code: 10000,
            data: {
                bookingRefId,
                orderStatus: 'ORDER_SUCCESS',
                remark: ''
            }
        });
        createBookingInOpenGds(req.body,'ORDER_SUCCESS','');                //booking ref id , orderStatus, remark
    });

    //Create booking in Open Gds


   

});

async function createBookingInOpenGds(requestBody,orderStatus,remark){
    const createBookingUrl = `https://api.opengds.com/core/v1/acc-reservation/create?apikey=oyn0qruhvmxckh24untseew33yt4f37jbjy535t5`;

    const params = {
        rate_id:requestBody.ratePlanId,
        accom_id:requestBody.roomId,
        arrival:requestBody.checkIn,
        depart:requestBody.checkOut,
        occupancy:requestBody.guestCount.rooms,
        first_name:requestBody.contact.firstName,
        last_name:requestBody.contact.lastName,
        phone:requestBody.contact.telephone,
        email:requestBody.contact.email,
    }

    await axios.post(createBookingUrl, params)
               .then(async (response) =>{

                  await entryIntoBookingLog(response,requestBody,orderStatus,remark);
               })
               .catch((error) => console.error(error));

}

async function entryIntoBookingLog(response,requestBody,orderStatus,remark){
    const sql = `INSERT INTO booking_logs (bookingRefId, orderStatus, remark, res_id) VALUES (?, ?, ?, ?)`;
    const value = [requestBody.bookingRefId,orderStatus,remark,response.data.res_id];
    
    connection.query(sql,value,(err,result)=>{

            if(!err){
                console.log("Booking log created");
                return;
            }else{
                throw err;
                return;
            }
        
    })
}


router.get("/get_reservation_list",async(req,res)=>{
    try {
        
        const query = `SELECT * from bookings`;

        connection.query(query,(err,result)=>{
            if(!err){
                const parsedResults = result.map(row => ({
                    ...row,
                    guests: JSON.parse(row.guests),
                    guestCount: JSON.parse(row.guestCount),
                    contact: JSON.parse(row.contact)
                  }));
                res.send({message:"Reservation List Fetched",status:200 ,data:parsedResults})
            }else{
                res.send({message:err.message,status:400});
            }
        })

    } catch (error) {
        res.send({message:error.message,status:400});
    }
});

router.get("/get_booking_log",async(req,res)=>{
    try {
        const query = `SELECT * from booking_logs`;
        connection.query(query,(err,result)=>{
            if(!err){
                res.send({message:"Booking Log List Fetched",status:200 ,data:result})
            }else{
                res.send({message:err.message,status:400});
            }
        })

    } catch (error) {
        res.send({message:error.message,status:400});
    }
});



module.exports = router;