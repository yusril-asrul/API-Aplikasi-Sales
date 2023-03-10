require('dotenv').config()

module.exports = {
    port : 5020,
    jwtSecret : process.env.JWT_SECRET,
    urlUpload : process.env.URL_UPLOAD_IMAGE,
    dirUpload : process.env.DIR_UPLOAD_IMAGE
}