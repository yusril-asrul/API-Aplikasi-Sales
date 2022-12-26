require('dotenv').config()

module.exports = {
    port : 4444,
    jwtSecret : process.env.JWT_SECRET
}