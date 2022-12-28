const connection = require('../config/database');
const modelHelper = require('./model-helper');
const {dirUpload} = require('../config/app')
const table = 'calon_user'

module.exports = {
    async simpanDataCalonUser(jns,data,id='',key=''){
        let query = await modelHelper.saveRowQuery(connection,table,data,id,jns,key)
        return query
    },
    async hapusDataCalonUser(id){
        return await modelHelper.deleteById(connection,table,id)
    },
    async loadDataCalonUser(idUser,id=''){
        let data = false;
        let detail = false 

        let query = `
            SELECT id,nama_usaha,pemilik_usaha,nohp,alamat,map_lat, map_long,
            applikasi_yang_digunakan,lama_tahun,lama_bulan,masa_berakhir,
            CONCAT('${dirUpload}',foto) as url_image,status
            FROM ${table} WHERE id_user = '${idUser}'`
        if (id) {
            query += ` AND id='${id}'`
            detail = true
        }

        let rows = await modelHelper.getRowsQuery(connection,query)

        if (detail){
            if (rows.length > 0){
                data = rows[0]
            }
        } else {
            data = rows
        }

        return data
    }
}