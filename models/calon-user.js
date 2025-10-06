const connection = require('../config/database');
const modelHelper = require('./model-helper');
const { dirUpload } = require('../config/app')
const table = 'calon_user'
const tableLog = 'log_calon_user'

module.exports = {
    async simpanDataCalonUser(jns, data, id = '', key = '') {
        let query = await modelHelper.saveRowQuery(connection, table, data, id, jns, key)
        return query
    },
    async simpanLogCalonUser(jns, data, id = '', key = '') {
        let query = await modelHelper.saveRowQuery(connection, tableLog, data, id, jns, key)
        return query
    },
    async hapusDataCalonUser(id) {
        return await modelHelper.deleteById(connection, table, id)
    },
    async loadDataCalonUser(idUser, id = '', cari = '', first_date = '', last_date = '') {
        let data = false;
        let detail = false

        let query = `
            SELECT id,nama_usaha,pemilik_usaha,nohp,alamat,
            jenis_usaha,
            jenis_user,
            catatan,nominal,
            map_lat, map_long,
            applikasi_yang_digunakan,lama_tahun,lama_bulan,
            masa_berakhir,
            CONCAT('${dirUpload}',foto) as url_image,
            status,
            keterangan,
            DATE_FORMAT(createdAt, "%d/%m/%Y %H:%i:%s") as create_at
            FROM ${table} WHERE id_user = '${idUser}'`
        if (id) {
            query += ` AND id='${id}'`
            detail = true
        }
        if (cari) {
            query += ` AND (
                nama_usaha like '%${cari}%'
                or pemilik_usaha like '%${cari}%'
            )`
        }
        if (first_date) {
            query += ` AND date(createdAt) between '${first_date}' and '${last_date}'`
        }

        query += ` ORDER BY id DESC`

        let rows = await modelHelper.getRowsQuery(connection, query)

        if (detail) {
            if (rows.length > 0) {
                data = rows[0]
            }
        } else {
            data = rows
        }

        return data
    },
    async cekNoHp(nohp) {
        let data = true;

        let query = `
            SELECT id
            FROM ${table} WHERE nohp = '${nohp}'`

        let rows = await modelHelper.getRowsQuery(connection, query)

        if (rows) {
            if (rows.length > 0) {
                data = false
            }
        }

        return data
    }
}