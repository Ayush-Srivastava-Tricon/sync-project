const express = require('express');
const db = require("./config/db.js");
const dotenv = require('dotenv');
const cors = require("cors");
const path = require('path');


dotenv.config();
const app = express();


app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'routes', 'uploads')));

app.use(express.json({ extended: false }));



app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/otaRoutes'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
