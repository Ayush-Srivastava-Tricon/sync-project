const express = require('express');
const router = express.Router();
const connection = require("../config/db.js");
const multer = require("multer")
const path = require('path');
const fs = require('fs');


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
    console.log(req.body);
    const siteIconPath = req.file ? '/uploads/' + req.file.filename : null; 

    console.log(siteIconPath);

    const sql = 'INSERT INTO ota (site_name, site_icon, site_endpoint, site_user, site_pass, site_apikey, site_otherinfo) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [siteName, siteIconPath, siteEndpoint, siteUser, sitePass, siteApiKey, siteOtherInfo];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to upload site information');
        } else {
            res.status(200).send({message:'OTA created successfully',status:200});
        }
    });
});

router.get('/getOta', upload.single('siteIcon'), (req, res) => {
    const sql = 'SELECT * FROM ota';

    connection.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to upload site information');
        } else {
            res.status(200).send({message:'Data Found',status:200,data:result});
        }
    });
});


module.exports = router;
