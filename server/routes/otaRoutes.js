const express = require('express');
const router = express.Router();
const connection = require("../config/db.js");
const multer = require("multer")
const path = require('path');
const fs = require('fs');
const axios = require("axios");
const apiMappings = require("../routes/apiMapping.js");
const { validateSellerToken } = require("../middleware/middleware.js");

// ******Setting OTA Icon file directory inside route folder**********

const uploadDirectory = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        if(file){
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    }
});

// ************Using multer package for uploading ota icons*********

const upload = multer({ storage });

// **********Api to add OTA details with site icon *******

router.post('/addOta', validateSellerToken, upload.single('siteIcon'),async (req, res) => {
    const { siteName, siteEndpoint, siteUser, sitePass, siteApiKey, siteOtherInfo, commission, commissionType } = req.body;
    const siteIconPath = req.file ? '/' + req.file.filename : null;

    const sql = 'INSERT INTO ota (site_name, site_icon, site_endpoint, site_user, site_pass, site_apikey, site_otherinfo, commission, commissionType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [siteName, siteIconPath, siteEndpoint, siteUser, sitePass, siteApiKey, siteOtherInfo, commission, commissionType];

    connection.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).send('Failed to upload site information');
        } else {
            res.status(200).send({ message: 'OTA created successfully', status: 200 });
        }
    });
});

// **********Api to Edit OTA details with site icon *******

router.post('/editOta', validateSellerToken,upload.single('siteIcon'), async (req, res) => {
  
    const { siteName, siteEndpoint, siteUser, sitePass, siteApiKey, siteOtherInfo, commission, commissionType, id } = req.body;
    const siteIconPath = req.file ? '/' + req.file.filename : req.body.siteIcon;

    const sql = `
    UPDATE ota
    SET 
      site_name = ?,
      site_icon = ?,
      site_endpoint = ?,
      site_user = ?,
      site_pass = ?,
      site_apikey = ?,
      site_otherinfo = ?,
      commission = ?,
      commissionType = ?
    WHERE id = ?`;

    const values = [siteName, siteIconPath, siteEndpoint, siteUser, sitePass, siteApiKey, siteOtherInfo, commission, commissionType, id];

    connection.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).send('Failed to upload site information');
        } else {
            res.status(200).send({ message: 'OTA Updated successfully', status: 200 });
        }
    });
});

// **********Api to Delete OTA details with site icon *******

router.post('/deleteOta', validateSellerToken, (req, res) => {
    const { id } = req.body;

    const sql = `DELETE FROM ota WHERE id = ?`;

    const values = [id];

    connection.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).send({ message: 'Something went wrong', status: 500 });
        } else {
            res.status(200).send({ message: 'Deleted successfully', status: 200 });
        }
    });
});

// **********Fetching All OTA LIST *******

router.get('/getOta', validateSellerToken, (req, res) => {
    const sql = 'SELECT * FROM ota';

    connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Failed to upload site information');
        } else {
            res.status(200).send({ message: 'Data Found', status: 200, data: result });
        }
    });
});


// **********Fetching Hotel/Property List from Third Party OTA and saving into DB *******

router.post('/get_property_list_and_save', validateSellerToken, async (req, res) => {
    const { site_details, apiUrl, authType } = req.body;
    console.log(343432);
    
    const headers = {};

    if (authType && authType.type === 'bearerToken') {
        headers['Authorization'] = `Bearer ${authType.token}`;
    }

    try {
        const response = await axios.get(apiUrl, { headers });
        console.log(response);
        
        const properties = response.data.properties;

        const query = 'SELECT property_id FROM properties';
        connection.query(query, (err, results) => {
            if (err) {
                res.status(500).send('Failed to query database');
                return;
            }

            const propertiesToInsert = properties.filter(property => {
                return !results.some(row => row.property_id == property.property_id);
            });

            propertiesToInsert.forEach(property => {
                insertProperty(site_details.site_name, property, site_details.ota_id);
            });

            res.status(200).send({ status: 200, message: 'Hotels Imported' });
        });
    } catch (error) {
        res.status(500).send({message:'Error fetching data from API or saving to database'});
    }
});


// *********This method will insert the fetched list into properties table **********

async function insertProperty(apiSource, apiProperty, ota_id) {
    const property = transformPropertyData(apiSource, apiProperty);
    const query = `INSERT INTO properties 
                   (property_id, property_type_id, name, address, postal_code, location, 
                    country_code, language, currency_code, time_zone, latitude, longitude, 
                    num_of_accoms, images, ota_id) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        property.property_id,
        property.property_type_id,
        property.name,
        property.address,
        property.postal_code,
        property.location,
        property.country_code,
        property.language,
        property.currency_code,
        property.time_zone,
        property.latitude,
        property.longitude,
        property.num_of_accoms,
        property.images,
        ota_id
    ];

    try {
        connection.query(query, values);
    } catch (error) {
        console.error(`Error inserting property with property_id into database:`, error);
    }
}


//***********FETCH HOTEL/PROPERTY LIST FROM DB*******

router.get("/get_property_list", validateSellerToken, async (req, res) => {
    try {
        const sql = 'SELECT * FROM properties';
        connection.query(sql, (err, result) => {
            if (err) {
                res.status(500).send('Failed to get properties list');
            } else {
                res.status(200).send({ message: 'Data Found', status: 200, data: result });
            }
        });
    }
    catch (error) {
        console.log(error);
    }

});

//***********FETCH HOTEL/PROPERTY LIST BY OTA FROM DB*********

router.post("/get_property_by_ota", validateSellerToken, async (req, res) => {
    try {
        const sql = 'SELECT * FROM properties WHERE ota_id = ?';
        const values = [req.body.ota_id];
        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Failed to get properties list');
            } else {
                res.status(200).send({ message: 'Data Found', status: 200, data: result });
            }
        });
    }
    catch (error) {
        console.log(error);
    }

});

//***********DELETE HOTEL/PROPERTY*********

router.post("/delete_property", validateSellerToken, async (req, res) => {
    try {
        const { id } = req.body;
        const sql = `DELETE FROM properties WHERE property_id = ?`;
        const values = [id];
        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Failed to Delete property');
            } else {
                res.status(200).send({ message: 'Deleted', status: 200 });
            }
        });
    }
    catch (error) {
        console.log(error);
    }

});


//***********FETCH ROOM LIST FROM THIRD PARTY OTA AND SAVE INTO DB*********

router.post("/get_room_list_and_save", validateSellerToken, async (req, res) => {
    const { site_details, apiUrl, authType } = req.body;

    const headers = {};

    if (authType && authType.type === 'bearerToken') {
        headers['Authorization'] = `Bearer ${auth.token}`;
    }

    try {
        const response = await axios.get(apiUrl, { headers });
        const properties = response.data.properties;

        const property = properties.find(p => p.property_id == site_details.property_id);

        const accommodations = [];

        property.rates.forEach(rate => {
            if (rate.accommodations) {
                rate.accommodations.forEach(room => {
                    insertRates(rate,room);
                    accommodations.push({
                        room_id: room.accom_id,
                        name: room.name,
                        description: room.description,
                        number_of_persons: room.number_of_persons,
                        extra_beds: room.extra_beds,
                        default_rate: room.default_rate,
                        rate_id: rate.rate_id,
                        images: room.images
                    });
                })
            }
        })

        const query = `SELECT room_id FROM rooms`;
        connection.query(query, (err, results) => {
            if (!err) {
                const roomsToInsert = accommodations.filter(rooms => {
                    return !results.some(row => row.room_id == rooms.room_id);
                });

                roomsToInsert.forEach(rooms => {
                    insertRooms(rooms, site_details.ota_id, site_details.property_id);
                });
                res.status(200).send({ status: 200, message: 'Rooms Imported', data: roomsToInsert });
            }
        })

    } catch (error) {
        res.status(500).send({ message: 'Error fetching data from API or saving to database', status: 500 });
    }
});

//***********METHOD WILL INSERT RATES LIST INTO DB*********

async function insertRates(rate,room){
    const rateQuery = "INSERT INTO rates (rate_id, room_id, board_code, rate_plan_id, allotment, price) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [rate.rate_id, room.accom_id, rate.name, rate.rate_id, rate.allotment || 5 , rate.price || 0 ];                     //allotment and price is not present in current ota api.
    
    connection.query(rateQuery, values, (err, result) => {
        if (!err) {
            return true;
        }else{
            console.log(err);
            return false;
        }
    });

}

//***********METHOD WILL INSERT ROOM LIST INTO DB*********

async function insertRooms(room, ota_id, property_id) {
    const query = `INSERT INTO rooms (room_id, name, description, number_of_persons, default_rate, extra_beds, images, ota_id, property_id, rate_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        room.room_id,
        room.name,
        room.description,
        room.number_of_persons,
        room.default_rate,
        room.extra_beds,
        room.images[0],
        ota_id,
        property_id,
        room.rate_id
    ];

    try {
        connection.query(query, values);
    } catch (error) {
        console.error(`Error inserting property with property_id into database:`, error);
    }
}

//**********FETCH ROOM LIST BY OTA ID AND HOTEL/PROPERTY ID *********

router.post("/get_rooms_by_property_and_ota", validateSellerToken, async (req, res) => {
    const { ota_id, property_id } = req.body;
    try {
        const query = `SELECT * FROM rooms WHERE ota_id = ${ota_id} AND property_id = ${property_id}`;
        connection.query(query, (err, result) => {
            if (err) {
                res.status(500).send('Failed to get room list');
            } else {
                res.status(200).send({ message: 'Data Found', status: 200, data: result });
            }
        });
    }
    catch (error) {
    }
});


//**********DELETE ROOM *********

router.post("/delete_room", validateSellerToken, async (req, res) => {
    try {
        const { id } = req.body;
        const sql = `DELETE FROM rooms WHERE room_id = ?`;
        const values = [id];
        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Failed to Delete Room');
            } else {
                res.status(200).send({ message: 'Deleted', status: 200 });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});

//**********THESE METHODS WILL GET MAPPING TO MANIPULATE THE KEYS OF THE DATA */

function getMapping(apiSource) {
    return apiMappings[apiSource] || {};
}


function transformPropertyData(apiSource, apiProperty) {
    const mapping = getMapping(apiSource);
    const transformedProperty = {};

    for (const [dbKey, apiKey] of Object.entries(mapping)) {
        transformedProperty[dbKey] = apiProperty[apiKey] !== undefined ? apiProperty[apiKey] : null;
    }

    if (transformedProperty.images) {
        transformedProperty.images = transformedProperty.images[0];
    }

    return transformedProperty;
}


//***************TRUCATING CALENDAR DATA FROM TABLE ****** */

async function deleteCalendarData(site_details) {
    const deleteQuery = `DELETE FROM calendar WHERE ota_id = ? AND property_id = ? AND room_id = ?`;
    const deleteValue = [site_details.ota_id, site_details.property_id, site_details.room_id];

    return new Promise((resolve, reject) => {
        connection.query(deleteQuery, deleteValue, (error, results) => {
            if (error) {
                reject(error);
                console.log(error);
            } else {
                resolve(results);
            }
        });
    });
};


//***************FETCH CALENDAR LIST FROM THRID PARTY OTA AND SAVE INTO DB****** */

router.post('/import_calendar_data_and_save', validateSellerToken, async (req, res) => {
    try {
        const { site_details, authType, apiUrl } = req.body;
        const user_id = req.headers['user_id'];
        await deleteCalendarData(site_details);
        await importAndSaveData(site_details, authType, apiUrl,user_id);
        res.send({ message: 'Data fetched and saved successfully', status: 200 });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching data', status: 500 });
    }
});


//***************METHOD WILL INSERT DATA INTO DB****** */

const importAndSaveData = async (site_details, authType, apiUrl,user_id) => {
    const dateRanges = getDateRanges(site_details?.from);
    for (const range of dateRanges) {
        const { from, till } = range;
        const url = `${apiUrl}&from=${from}&till=${till}`;
        const data = await fetchCalendarData(from, till, authType, url);
        await saveDataToDatabase(data, site_details,user_id);
    }
};

//***************METHOD WILL GET THE RANGES FOR 'from' and 'till' OF 1 YEAR CALENDAR DATA ****** */


const getDateRanges = (startDate) => {
    const ranges = [];
    const chunkSize = 75;
    const daysInYear = 365;
    const start = startDate ? new Date(startDate) : formatDate(new Date());

    const end = new Date(start);

    end.setDate(new Date(start).getDate() + daysInYear - 1);

    let currentStart = new Date(start);


    while (currentStart <= end) {
        let currentEnd = new Date(currentStart);
        currentEnd.setDate(currentEnd.getDate() + chunkSize - 1);

        if (currentEnd > end) {
            currentEnd = end;
        }

        ranges.push({
            from: currentStart.toISOString().split('T')[0],
            till: currentEnd.toISOString().split('T')[0]
        });

        currentStart.setDate(currentStart.getDate() + chunkSize);
    }



    if (ranges.length > 0) {
        const lastRange = ranges[ranges.length - 1];
        const finalEndDate = new Date(start);

        console.log(lastRange, finalEndDate);
        finalEndDate.setDate(finalEndDate.getDate() + daysInYear - 1); // -1 to get the actual end date
        if (lastRange.till !== finalEndDate.toISOString().split('T')[0]) {
            ranges[ranges.length - 1] = { ...lastRange, till: finalEndDate.toISOString().split('T')[0] };
        }
    }

    console.log(ranges);
    
    return ranges;
};

const fetchCalendarData = async (from, till, authType, apiUrl) => {
    try {
        const headers = {};
        if (authType && authType.type === 'bearerToken') {
            headers['Authorization'] = `Bearer ${authType.token}`;
        }
        const response = await axios.get(apiUrl, { headers });
        return response.data;

    } catch (error) {
        throw new Error(`Failed to fetch data from ${from} to ${till}`);
    }
};

const saveDataToDatabase = async (data, site_details,userId) => {
    const query = `INSERT INTO calendar 
    (room_id, rate_id, start_date, available, rate, min, max, ota_id, property_id, room_name, ota_user_id, user_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const commissionQuery = `SELECT commission, commissionType FROM ota WHERE id = ?`;
    const commissionValue = [site_details.ota_id];

  
    
    const commission = (query, values) => {
        return new Promise((resolve, reject) => {
            connection.query(query, values, (error, results) => {
                if (error) {
                    reject(error);
                    console.log(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    const commissionResult = await commission(commissionQuery, commissionValue);

    

    const queryAsync = (query, values) => {
        return new Promise((resolve, reject) => {
            connection.query(query, values, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    try {
        for (const item of data) {
            const values = [
                site_details.room_id,
                site_details.rate_id,
                item.date,
                item.available || 5,   //5 will be remove if available
                item.rate = commissionResult[0].commissionType == 'fixed' ? (+item.rate + +commissionResult[0].commission) : (+item.rate + getCalculatedRoomRate(item.rate, commissionResult[0].commission)),
                item.minlos,
                item.maxlos,
                site_details.ota_id,
                site_details.property_id,
                site_details.room_name,
                site_details.ota_user_id ? site_details.ota_user_id : 0,
                userId
            ];

            const results = await queryAsync(query, values);
        }
    } catch (error) {
        console.error('Error inserting data:', error.message);
    }
};

// *****************METHOD WILL CALCULATE AND RETURN PRICE/RATE OF THE ROOM ACCORDING TO COMMISSION ADJUSTED*****

function getCalculatedRoomRate(rate, commission) {
    return +((commission / 100) * rate).toFixed(2);
}


// *****************FETCH DATA FROM CALENDAR BY START DATE AND END DATE (from and till)*****


router.post("/fetch_calendar_data_by_start_end_date", validateSellerToken, async (req, res) => {
    try {

        const { start_date, room_id, ota_id, property_id } = req.body;
       
            query = `SELECT * 
                         FROM calendar
                         WHERE ota_id = ? 
                           AND property_id = ? 
                           AND room_id = ? 
                           AND start_date >= ?`;

            values = [ota_id, property_id, room_id, start_date];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.error('Error fetching data:', error.message);
            } else {
                const data = [{
                    room_id: room_id,
                    room_name: results?.[0]?.room_name,
                    data: results
                }]
                res.send({ message: 'Data Found', data: data, status: 200 });
            }
        });

    } catch (error) {

    }
});


//***********FETCH ALL CALENDAR DATA */

router.get("/fetch_all_calendar_data", validateSellerToken, (req, res) => {
    const user_id = req.headers['user_id'];
    const query = `SELECT * FROM calendar WHERE user_id = ?`;
    const value = [user_id];
    connection.query(query,value, (err, results) => {
        if (!err) {
            const obj = {};
            results.forEach((ele) => {
                const { room_id, room_name } = ele;
                if (!obj[room_id]) {
                    obj[room_id] = {
                        room_id,
                        room_name,
                        data: []
                    };
                }
                obj[room_id].data.push(ele);
            });

            const data = Object.values(obj);
            res.status(200).send({ message: "Data found", data: data, status: 200 });
        } else {
            res.status(400).send({ message: err.sqlMessage, status: 400 });
        }
    })
})



//***********METHOD WILL FORMAT DATE INTO YYYY-MM-DD */

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

// **********Fetching OTA LIST By User *******

router.get('/getOtaByUser', validateSellerToken, (req, res) => {
    const user_id = req.headers['user_id'];
    const sql = 'SELECT * , ota_name as site_name FROM ota_user WHERE user_id = ?';
    const value = [user_id];
    connection.query(sql, value,(err, result) => {
        if (err) {
            res.status(500).send('Failed to upload site information');
        } else {
            res.status(200).send({ message: 'Data Found', status: 200, data: result });
        }
    });
});


// **********Add OTA LIST By User *******

router.post('/addOtaUser', validateSellerToken, upload.single('siteIcon'),async (req, res) => {
    const user_id = req.headers['user_id'];
    console.log(user_id);
    
    const { ota_id, siteName, siteUser, sitePass, siteApiKey, siteOtherInfo, commission, commissionType } = req.body;
    console.log(req.body);
    
    const siteIconPath = req.file ? '/' + req.file.filename : null;

    const sql = 'INSERT INTO ota_user (ota_id, ota_name, site_icon, site_user, site_pass, site_apikey, site_otherinfo, commission, commissionType, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [ota_id, siteName, siteIconPath, siteUser, sitePass, siteApiKey, siteOtherInfo, commission, commissionType, user_id];

    connection.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).send({message:'Failed to upload site information',error:err});
        } else {
            res.status(200).send({ message: 'OTA created successfully', status: 200 });
        }
    });
});

// **********Edit OTA LIST By User *******

router.post('/editOtaUser', validateSellerToken, upload.single('siteIcon'),async (req, res) => {
    const user_id = req.headers['user_id'];
    
    const { ota_id, siteUser, sitePass, siteApiKey, siteOtherInfo, commission, commissionType, id } = req.body;
    const siteIconPath = req.file ? '/' + req.file.filename : req.body.siteIcon;
    console.log(req.body);
    

    const sql = `
    UPDATE ota_user
    SET 
      ota_id = ?,
      site_icon = ?,
      site_user = ?,
      site_pass = ?,
      site_apikey = ?,
      site_otherinfo = ?,
      commission = ?,
      commissionType = ?
    WHERE ota_user_id = ?`;

    const values = [ota_id, siteIconPath, siteUser, sitePass, siteApiKey, siteOtherInfo, commission, commissionType, id];

    connection.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).send({message:'Failed to upload site information',error:err});
        } else {
            res.status(200).send({ message: 'OTA Updated successfully', status: 200 });
        }
    });
});

// **********Api to Delete OTA details with site icon *******

router.post('/deleteOtaUser', validateSellerToken, (req, res) => {
    const { id } = req.body;

    const sql = `DELETE FROM ota_user WHERE ota_user_id = ?`;

    const values = [id];

    connection.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).send({ message: 'Something went wrong', status: 500 });
        } else {
            res.status(200).send({ message: 'Deleted successfully', status: 200 });
        }
    });
});



module.exports = router;
