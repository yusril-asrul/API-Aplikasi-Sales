require('dotenv').config()
const mysql = require('mysql');
const database = {
    host: process.env.DB_MYSQL_HOST,
    user: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    database: process.env.DB_MYSQL_NAME
}
let connection = mysql.createPool(database);
connection.getConnection((err,connection)=>{
    if (err) throw err; // not connected!
    console.log("Database Connected");
})
module.exports = connection