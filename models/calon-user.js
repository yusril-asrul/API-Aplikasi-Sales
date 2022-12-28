const connection = require('../config/database');
const modelHelper = require('./model-helper');
const table = 'calon_user'

module.exports = {
    async simpanDataCalonUser(jns,data,id='',key=''){
        let query = await modelHelper.saveRowQuery(connection,table,data,id,jns,key)
        return query
    },
    async hapusDataCalonUser(id){
        return await modelHelper.deleteById(connection,table,id)
    }
}