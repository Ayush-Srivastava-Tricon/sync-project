const express = require('express');
const router = express.Router();
const connection = require("../config/db.js");
const multer = require("multer")
const path = require('path');
const fs = require('fs');
const axios = require("axios");
const apiMappings = require("../routes/apiMapping.js");

const uploadDirectory = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/addOta', upload.single('siteIcon'), (req, res) => {
    const { siteName, siteEndpoint, siteUser, sitePass, siteApiKey, siteOtherInfo } = req.body;
    const siteIconPath = req.file ? '/uploads/' + req.file.filename : null;

    const sql = 'INSERT INTO ota (site_name, site_icon, site_endpoint, site_user, site_pass, site_apikey, site_otherinfo) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [siteName, siteIconPath, siteEndpoint, siteUser, sitePass, siteApiKey, siteOtherInfo];

    connection.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).send('Failed to upload site information');
        } else {
            res.status(200).send({ message: 'OTA created successfully', status: 200 });
        }
    });
});

router.get('/getOta', upload.single('siteIcon'), (req, res) => {
    const sql = 'SELECT * FROM ota';

    connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Failed to upload site information');
        } else {
            res.status(200).send({ message: 'Data Found', status: 200, data: result });
        }
    });
});

router.post('/get_property_list_and_save', async (req, res) => {
    const { site_details, apiUrl, authType } = req.body;

    const headers = {};

    if (authType && authType.type === 'bearerToken') {
        headers['Authorization'] = `Bearer ${authType.token}`;
    }

    try {
        const response = await axios.get(apiUrl, { headers });
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
        res.status(500).send('Error fetching data from API or saving to database');
    }
});

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


router.get("/get_property_list", async (req, res) => {
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

})

router.post("/get_property_by_ota", async (req, res) => {
    try {
        const sql = 'SELECT * FROM properties ';
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

router.post("/get_room_list_and_save", async (req, res) => {
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

router.post("/get_rooms_by_property_and_ota", async (req, res) => {
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
        // transformedProperty.images = JSON.stringify(transformedProperty.images);
        transformedProperty.images = transformedProperty.images[0];
    }

    return transformedProperty;
}

router.post('/import_calendar_data_and_save', async (req, res) => {
    try {
        const {site_details,authType,apiUrl} = req.body;
        await importAndSaveData(site_details ,authType ,apiUrl);
        res.send({message:'Data fetched and saved successfully',status:200});
    } catch (error) {
        res.status(500).send('Error fetching data df sdf');
    }
});

 const importAndSaveData = async (site_details ,authType,  apiUrl ) => {
    const dateRanges = getDateRanges(site_details?.from);
    for (const range of dateRanges) {
        const { from, till } = range;
        const url = `${apiUrl}&from=${from}&till=${till}`;
        const data = await fetchCalendarData(from, till,authType,url);
        await saveDataToDatabase(data,site_details);
    }
};

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

        console.log(lastRange , finalEndDate);
        finalEndDate.setDate(finalEndDate.getDate() + daysInYear - 1); // -1 to get the actual end date
        if (lastRange.till !== finalEndDate.toISOString().split('T')[0]) {
            ranges[ranges.length - 1] = { ...lastRange, till: finalEndDate.toISOString().split('T')[0] };
        }
    }
    

    return ranges;
};

const fetchCalendarData = async (from, till,authType,apiUrl) => {
    try {
        const headers = {};
        if (authType && authType.type === 'bearerToken') {
            headers['Authorization'] = `Bearer ${authType.token}`;
        }
        const response = await axios.get(apiUrl, {headers});
        return response.data;

    } catch (error) {
        throw new Error(`Failed to fetch data from ${from} to ${till}`);
    }
};

const saveDataToDatabase = async (data,site_details) => {
    const query = `INSERT INTO calendar 
    (room_id, rate_id, start_date, available, rate, min, max, ota_id, property_id, room_name) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
                item.available || 5,
                item.rate,
                item.minlos,
                item.maxlos,
                site_details.ota_id,
                site_details.property_id,
                site_details.room_name
            ];

            const results = await queryAsync(query, values);
        }
    } catch (error) {
        console.error('Error inserting data:', error.message);
    }
};


router.post("/fetch_calendar_data_by_start_end_date",async (req,res)=>{
    try {

            const {start_date,room_id,ota_id,property_id,end_date} = req.body;

            if (end_date) {
                query = `SELECT * 
                         FROM calendar
                         WHERE ota_id = ? 
                           AND property_id = ? 
                           AND room_id = ? 
                           AND start_date >= ? 
                           AND start_date <= ?`;
                values = [ota_id, property_id, room_id, start_date, end_date];
            } else {
                query = `SELECT * 
                         FROM calendar
                         WHERE ota_id = ? 
                           AND property_id = ? 
                           AND room_id = ? 
                           AND start_date >= ? 
                           AND start_date < DATE_ADD(?, INTERVAL 1 MONTH)`;
                values = [ota_id, property_id, room_id, start_date, start_date];
            }

            connection.query(query, values, (error, results) => {
                if (error) {
                    console.error('Error fetching data:', error.message);
                } else {
                    const data = [{
                        room_id : room_id,
                        room_name: results?.[0]?.room_name,
                        data:results
                    }]
                    res.send({message:'Data Found',data:data,status:200});
                }
            });

    } catch (error) {
        
    }
});

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




module.exports = router;