require('dotenv').config();
const mysql = require('mysql'); // Menggunakan mysql2/promise untuk dukungan async/await

const pool = mysql.createPool({
    host: process.env.DB_MYSQL_HOST_BOOBLE,
    user: process.env.DB_MYSQL_USER_BOOBLE,
    password: process.env.DB_MYSQL_PASSWORD_BOOBLE,
    database: process.env.DB_MYSQL_NAME_BOOBLE,
    waitForConnections: true,
    queueLimit: 0
});

module.exports = pool;