require('dotenv').config()
const mysql = require('mysql');
const database = {
    host: process.env.DB_MYSQL_HOST_BOOBLE,
    user: process.env.DB_MYSQL_USER_BOOBLE,
    password: process.env.DB_MYSQL_PASSWORD_BOOBLE,
    database: process.env.DB_MYSQL_NAME_BOOBLE
}
let connection = mysql.createPool(database);
connection.getConnection((err,connection)=>{
    if (err) throw err; // not connected!
    console.log("Database Connected");
})
module.exports = connection