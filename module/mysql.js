const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: null, 
    database: "shop1"
});

module.exports = con;