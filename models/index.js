const auth = require('./auth')
const calonUser = require('./calon-user')
const dataRegistrasi = require('./data-registrasi')

module.exports = {
    ...calonUser,
    ...dataRegistrasi,
    ...auth
}