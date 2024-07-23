const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());

connectDB();

app.use(express.json({ extended: false }));

app.use('/api', require('./routes/userRoutes'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
