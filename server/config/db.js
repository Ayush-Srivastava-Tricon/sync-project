const mysql = require('mysql');


// Mysql connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: "",
    database: "sync_project"             
})


connection.connect(function(err) {
    if (err) throw err;
    console.log("mysql connected");
});

module.exports = connection;