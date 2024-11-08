const express = require('express');
const router = express.Router();
const axios = require("axios");
const connection = require("../config/db.js");
const otaConfig = require("./otaConstant.js");
const { validateSellerToken, validateAdminToken } = require("../middleware/middleware.js");
// const { startCronJob } = require('../cron.js');

// *************** HOTEL INVENTORY ************

router.get("/hotel_inventory", validateSellerToken, async (req, res) => {
    const query = `
    SELECT 
        p.id AS property_id,
        p.property_id AS property_unique_id,
        p.name AS property_name,
        p.address,
        p.postal_code,
        p.location,
        p.country_code,
        p.language,
        p.currency_code,
        p.time_zone,
        p.longitude,
        p.latitude,
        p.num_of_accoms,
        p.images AS property_images,
        p.ota_id AS property_ota_id,
        r.room_id,
        r.name AS room_name,
        r.description,
        r.number_of_persons,
        r.default_rate,
        r.images AS room_images,
        r.extra_beds,
        r.ota_id AS room_ota_id,
        r.property_id AS room_property_id,
        r.rate_id
    FROM properties p
    LEFT JOIN rooms r ON p.property_id = r.property_id;
  `;

    connection.query(query, (error, results) => {
        if (error) throw error;

        const propertiesMap = {};

        results.forEach(row => {
            const propertyId = row.property_id;

            if (!propertiesMap[propertyId]) {
                propertiesMap[propertyId] = {
                    property_id: row.property_unique_id,
                    property_name: row.property_name,
                    address: row.address,
                    postal_code: row.postal_code,
                    location: row.location,
                    country_code: row.country_code,
                    language: row.language,
                    currency_code: row.currency_code,
                    time_zone: row.time_zone,
                    longitude: row.longitude,
                    latitude: row.latitude,
                    num_of_accoms: row.num_of_accoms,
                    images: row.property_images ? row.property_images : [],
                    ota_id: row.property_ota_id,
                    rooms: []
                };
            }

            if (row.room_id) {
                propertiesMap[propertyId].rooms.push({
                    room_id: row.room_id,
                    name: row.room_name,
                    description: row.description,
                    number_of_persons: row.number_of_persons,
                    default_rate: row.default_rate,
                    room_images: row.room_images ? row.room_images : [],
                    extra_beds: row.extra_beds,
                    ota_id: row.room_ota_id,
                    property_id: row.room_property_id,
                    rate_id: row.rate_id
                });
            }
        });

        const propertiesArray = Object.values(propertiesMap);
        res.send({ message: "Success", data: propertiesArray });
    })
})



// ***************CHECK HOTEL AVAILABILITY ************

router.post("/hotel_availability", validateSellerToken, async (req, res) => {
    const { check_in, check_out, occupancy, hotel_id, room_id } = req.body;

    if(new Date(check_in).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)){
        res.send({message:"Check in date is in the past"});
        return;
    }

    const diffInMs = new Date(check_out) - new Date(check_in);               //DIFFERENCE DAYS BETWEEN CHECK IN AND CHECK OUT DATE
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    let query = `
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

        if(hotel_id){
            query+= ' AND h.property_id = ?';
            values.push(hotel_id)
        }
        if(room_id){
            query+= ' AND r.room_id = ?';
            values.push(room_id)
        }


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
                if ((diffInDays >= row.min && diffInDays <= row.max) && (row.stopSale == '0' || row.stopSale == 0)) {
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
                                rateId: row.rateId,
                                ratePlanId: row.ratePlanId,
                                availability: row.availability,
                                price: row.rate * diffInDays,
                                currency: row.currencyCode
                            }
                        ]
                    };

                    hotels[row.hotelId].rooms.push(room);
                }
            });


            const response = {
                msg: "Success",
                code: 10000,
                data: {
                    check_in,
                    check_out,
                    currency: "EUR",
                    hotels: Object.values(hotels)
                }
            };

            res.status(200).send(response);
        } else {


            res.status(400).send({ message: err, status: 400 });
        }
    })

});


// *************CHECK BOOKING AVAILABILITY********

router.post("/booking_availability", validateSellerToken, async (req, response) => {

    const { checkIn, checkOut, occupancy, hotelId, roomId, currency, rateId } = req.body;

    const otaQuery = `SELECT o.id, o.site_name, o.site_apiKey AS apiKey FROM OTA o JOIN rooms r ON o.id = r.ota_id WHERE r.room_id = ? AND r.property_id = ?`;
    const value = [roomId, hotelId];

    const valueForParamData = {
        rate_id: rateId,
        accom_id: roomId,
        occupancy: occupancy.adults,
    };


    let url = await new Promise((resolve, reject) => {
        connection.query(otaQuery, value, (err, result) => {
            if (!err) {
                fullUrl = getApiUrl(result[0], 'GET_CALENDAR_DATA', valueForParamData);
                resolve(fullUrl)
            }
        });
    });

    url = `${url}&from=${checkIn}&till=${checkOut}`;

    const result = await axios.get(url);

    if (result.length === 0) {
        return res.status(404).json({ msg: 'No availability found', code: 10002 });
    }

    result.data.forEach(item => {
        const query = `UPDATE calendar SET rate = ?, min = ?, max = ?, available = ? WHERE start_date = ? AND property_id = ? AND room_id = ?`;
        const values = [item.rate, item.minlos, item.maxlos, item.available ? item.available : 1, item.date, hotelId, roomId];

        connection.query(query, values, (err, results) => {
            if (err) {
                console.error('Error updating record:', err);
            } else {
                console.log('Record updated:', results.affectedRows);
            }
        });
    });

    const getHotelQuery = `SELECT properties.name as hotelName, properties.property_id as hotelId, rooms.name AS roomName from properties JOIN rooms ON properties.property_id = rooms.property_id WHERE properties.property_id = ${hotelId} AND rooms.room_id = ${roomId}`;
    const hotels = {};

    connection.query(getHotelQuery, (err, res) => {
        if (!err) {
            hotels['name'] = res[0].hotelName;
            hotels['hotelId'] = res[0].hotelId,
                hotels['room'] = [
                    {
                        roomId,
                        name: res[0].roomName,
                        rates: [{
                            availability: result.data[0].available,
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

        } else {
            console.log(err);
            response.json(err);
        }
    });
});


// **************CREATE RESERVATION/BOOKING *********

router.post("/create_bookings", validateSellerToken, async (req, res) => {
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
            res.status(500).json({ message: err.sqlMessage });
            return;
        }
        const resData = {
            bookingRefId,
            orderStatus: 'ORDER_SUCCESS',
            remark: ''
        }
        res.status(200).json({
            msg: 'Success',
            code: 10000,
            data: resData
        });

        //Create booking for specific OTA's 
        createBookingForOTA(req.body, resData.orderStatus, resData.remark);                //booking ref id , orderStatus, remark
    });

});


// **************METHOD IS USE TO CREATE BOOKING FOR THIRD PARTY OTA **********


async function createBookingForOTA(requestBody, orderStatus, remark) {

    const otaQuery = `SELECT o.id, o.site_name, o.site_apiKey AS apiKey FROM OTA o JOIN rooms r ON o.id = r.ota_id WHERE r.room_id = ? AND r.property_id = ?`;
    const value = [requestBody.roomId, requestBody.hotelId];

    connection.query(otaQuery, value, async (err, result) => {
        if (!err) {

            const bookingUrl = getApiUrl(result[0], 'CREATE_RESERVATION_BOOKING', {});

            const params = {
                rate_id: requestBody.ratePlanId,
                accom_id: requestBody.roomId,
                arrival: requestBody.checkIn,
                depart: requestBody.checkOut,
                occupancy: requestBody.guestCount.rooms,
                first_name: requestBody.contact.firstName,
                last_name: requestBody.contact.lastName,
                phone: requestBody.contact.telephone,
                email: requestBody.contact.email,
            }
            await axios.post(bookingUrl, params)
                .then(async (response) => {

                    await entryIntoBookingLog(response, requestBody, orderStatus, remark);
                })
                .catch((error) => console.error(error));
        } else {
            console.log(err);
        }
    })
}

// **********METHOD WILL CREATE A BOOKING LOG AFTER BOOKING IS DONE ********

async function entryIntoBookingLog(response, requestBody, orderStatus, remark) {
    const sql = `INSERT INTO booking_logs (bookingRefId, orderStatus, remark, res_id) VALUES (?, ?, ?, ?)`;
    const value = [requestBody.bookingRefId, orderStatus, remark, response.data.res_id];

    connection.query(sql, value, (err, result) => {

        if (!err) {
            console.log("Booking log created");
            return;
        } else {
            throw err;
            return;
        }
    })
}


// ************FETCH RESERVATION/BOOKING LIST FROM DB********


router.get("/get_reservation_list", validateAdminToken, async (req, res) => {
    const user_id = req.headers['userid'];
    try {

        const query = `SELECT * from bookings WHERE user_id = ? `;
        const value = [user_id]
        connection.query(query,value, (err, result) => {
            if (!err) {
                const parsedResults = result.map(row => ({
                    ...row,
                    guests: JSON.parse(row.guests),
                    guestCount: JSON.parse(row.guestCount),
                    contact: JSON.parse(row.contact)
                }));
                res.send({ message: "Reservation List Fetched", status: 200, data: parsedResults })
            } else {
                res.send({ message: err.message, status: 400 });
            }
        })

    } catch (error) {
        res.send({ message: error.message, status: 400 });
    }
});

// ************FETCH BOOKING LOG LIST FROM DB********


router.get("/get_booking_log", validateAdminToken, async (req, res) => {
    const user_id = req.headers['userid'];
    try {

        const query = `SELECT * from booking_logs WHERE user_id = ?`;
        const value = [user_id];
        connection.query(query,value, (err, result) => {
            if (!err) {
                res.send({ message: "Booking Log List Fetched", status: 200, data: result })
            } else {
                res.send({ message: err.message, status: 400 });
            }
        })

    } catch (error) {
        res.send({ message: error.message, status: 400 });
    }
});

// ************METHOD WILL DYNAMICALLY CREATE A URL FOR CALLING THIRD PARTY API OF DIFFERENT OTA'S********


function getApiUrl(result, actionUrl, valueForParamData) {
    let ota_site_name = result.site_name.toLowerCase().split(" ").join("_");
    let apikey = result.apiKey;

    const { url, auth, action_url } = otaConfig[ota_site_name];

    let fullUrl = `${url}/${action_url[actionUrl]['url']}`;
    let queryParamsForApi = action_url[actionUrl]['params'];
    valueForParamData['apikey'] = apikey;

    if (queryParamsForApi) {
        Object.keys(queryParamsForApi).forEach(key => {
            if (queryParamsForApi[key]) {
                fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${key}=${valueForParamData[key]}`;
            }
        });
    }

    const header = {};

    if (auth.type == 'bearer') {
        header['Bearer'] = '';  //token Value
    }

    return fullUrl;
}


// **************API TO VERIFY BOOKING *********

router.post("/booking_verify", validateSellerToken, async (req, res) => {
    const { bookingRefId } = req.body;

    const query = `SELECT bookings.*, log.orderStatus AS orderStatus FROM bookings JOIN booking_logs log ON bookings.bookingRefId = log.bookingRefId WHERE bookings.bookingRefId = ? `;
    const value = [bookingRefId];

    connection.query(query, value, (err, result) => {
        if (!err) {
            const parsedResults = result.map(row => ({
                ...row,
                orderStatus: result[0].orderStatus,
                guests: JSON.parse(row.guests),
                guestCount: JSON.parse(row.guestCount),
                contact: JSON.parse(row.contact),
            }));
            res.send({ status: 200, message: "Booking Found", data: parsedResults });
        } else {
            console.log(err);
            res.send({ status: 400, message: "Booking not found" });
        }
    })

});

// **************API TO CANCEL BOOKING *********

router.post("/booking_cancel", validateSellerToken, async (req, res) => {
    const { bookingRefId } = req.body;

    const cancelQuery = `UPDATE booking_logs SET orderStatus = 'ORDER_CANCEL' WHERE bookingRefId = '${bookingRefId}'`;

    connection.query(cancelQuery, (err, result) => {
        if (!err) {
            const response = {
                "orderStatus": "ORDER_CANCEL",
                "bookingRefId": bookingRefId,
                "cancellationFees": 0    //set accordingly
            };

            if (cancelBookingForOTA(bookingRefId)) {
                res.send({ status: 200, message: "Booking Cancelled", data: response });
            } else {
                res.send({ status: 400, message: "Something went wrong" });
            }

        } else {
            console.log(err);
            res.send({ status: 400, message: "Something went wrong" });
        }
    })

});

function cancelBookingForOTA(bookingRefId) {
    console.log("BOOKING ", bookingRefId);
    return true;

}


module.exports = router;