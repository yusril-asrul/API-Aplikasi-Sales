require('dotenv').config()

module.exports = {
    port : 4444,
    jwtSecret : process.env.JWT_SECRET,
    urlUpload : process.env.URL_UPLOAD_IMAGE,
    dirUpload : process.env.DIR_UPLOAD_IMAGE
}