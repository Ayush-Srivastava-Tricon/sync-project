const express = require('express');
const router = express.Router();
const connection = require("../config/db.js");
const multer = require('multer');
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
        if(file){
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    }
});

const upload = multer({ storage });

router.post('/update_content', upload.single('image'),async (req, res) => {
    const {section} = req.body;
    let content = JSON.parse(req.body.content);
    
    if (req.file && section == 'home') {
        content.content_data.main_image = `/uploads/${req.file.filename}`;
    }
    else if (req.file && section == 'our_role') {
        content.content_data.background_image = `/uploads/${req.file.filename}`;
    }
    
    let sql = ` UPDATE content SET content_data = ? WHERE section = ?`;
    
    const value = [JSON.stringify(content.content_data), section];
    
    connection.query(sql, value, (err, result) => {
        if (err) throw err;
        res.send({message:"Section Updated",status:200});
    });
});

router.post('/update_content/about_us', upload.any() ,async (req, res) => {
    const files = req.files;
    const aboutUsData = JSON.parse(req.body.cards);
    console.log(aboutUsData);
    
    files.forEach(file => {
        console.log(file);
        
        const [section, index, field] = file.fieldname.split('_');
        if (section == 'card') {
            console.log(file.path ,field ,index);
            
            aboutUsData.cards[index]['image_path'] = `/uploads/${file.filename}`;
        }
    });

    const query = `
        UPDATE content 
        SET content_data = ? 
        WHERE section = 'about_us'
    `;
    connection.query(query, [JSON.stringify( aboutUsData)], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error', details: err });
        }
        res.send({ message: 'Section Updated successfully!',status:200 });
    });
});

router.get('/get_content',async (req, res) => {
    let sql = `SELECT * FROM content`;
    connection.query(sql, (err, results) => {
        if (err) throw err;
        const parsedResults = results.map(row => ({
            ...row,
            content_data: JSON.parse(row.content_data)
        }));
        res.send({message:"found",status:200,data:parsedResults});
    });
});


module.exports = router ;