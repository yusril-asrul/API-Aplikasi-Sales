const connection = require('../config/database');
const modelHelper = require('./model-helper');

module.exports = {
    async getDataUserByUsername(username){
        const query = `SELECT id,username,password as salt,nama,nohp,email FROM users WHERE username = '${username}' AND isActive = 1`
        const data = await modelHelper.getRowsQuery(connection,query)
        if (data && data.length > 0){
            return data[0]
        }
        return false
    },
}