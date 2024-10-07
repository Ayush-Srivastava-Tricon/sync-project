const express = require('express');
const db = require("./config/db.js");
const dotenv = require('dotenv');
const cors = require("cors");
const path = require('path');
const callApi = require("./cron.js");
dotenv.config();

const sellersecretkey = process.env.SELLER_SECRET_KEY;
const adminsecretkey = process.env.ADMIN_SECRET_KEY;

const app = express();


app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'routes', 'uploads')));

app.use(express.json({ extended: false }));


app.get("/call", async (req, res) => {
    const result = await callApi();
    res.status(200).send({ data: result });

})


app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/otaRoutes'));
app.use('/api', require('./routes/reservationRoutes.js'));
app.use('/api', require('./routes/contentRoutes.js'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

exports.sellersecretkey = sellersecretkey;
exports.adminsecretkey = adminsecretkey;

