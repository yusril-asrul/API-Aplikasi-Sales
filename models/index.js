const auth = require('./auth')
const calonUser = require('./calon-user')

module.exports = {
    ...calonUser,
    ...auth
}