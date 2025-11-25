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
    async loadDataCalonUser(idUser, id = '', cari = '', first_date = '', last_date = '', status = '') {
        let data = false;
        let detail = false

        let query = `
            SELECT id,nama_usaha,pemilik_usaha,nohp,alamat,
            jenis_usaha,
            jenis_user,
            catatan,
            ifnull(nominal,0) as nominal,
            map_lat, map_long,
            applikasi_yang_digunakan,lama_tahun,lama_bulan,
            masa_berakhir,
            CONCAT('${dirUpload}',foto) as url_image,
            status,
            keterangan,
            DATE_FORMAT(createdAt, "%d/%m/%Y %H:%i:%s") as create_at
            FROM ${table} WHERE id_user = '${idUser}' AND id_telesales is not null AND id_telesales <> '0'`
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
        if (status) {
            query += ` AND status = '${status}'`
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
    async loadDataCalonUserLost() {

        let query = `
            SELECT id,nama_usaha,pemilik_usaha,nohp,alamat,
            jenis_usaha,
            jenis_user,
            catatan,
            ifnull(nominal,0) as nominal,
            map_lat, map_long,
            applikasi_yang_digunakan,lama_tahun,lama_bulan,
            masa_berakhir,
            CONCAT('${dirUpload}',foto) as url_image,
            status,
            keterangan,
            DATE_FORMAT(createdAt, "%d/%m/%Y %H:%i:%s") as create_at
            FROM ${table} WHERE status = 'Lose'`

        query += ` ORDER BY id DESC`

        let rows = await modelHelper.getRowsQuery(connection, query)

        let data = rows

        return data
    },
    async loadJenisFollowUp() {
        let query = `
            SELECT 
                label,
                pesan
            FROM format_follow_up
            ORDER BY id`

        let rows = await modelHelper.getRowsQuery(connection, query)

        data = rows

        return data
    },
    async loadDataCalonUserExport(idUser, id = '', cari = '', first_date = '', last_date = '', status = '') {
        let data = false;
        let detail = false

        let query = `
            SELECT 
                a.id,
                DATE_FORMAT(a.createdAt, "%d/%m/%Y") as tanggal_input,
                a.nama_usaha,
                a.pemilik_usaha,
                a.alamat,
                a.nohp,
                a.applikasi_yang_digunakan as aplikasi_yang_digunakan,
                concat(
                    if(a.lama_tahun > 0, concat(a.lama_tahun, ' Tahun '), ''),
                    if(a.lama_bulan > 0, concat(a.lama_bulan, ' Bulan'), '')
                ) as lama_langganan,
                if(a.masa_berakhir = '0000-00-00', '-', DATE_FORMAT(a.masa_berakhir, "%d/%m/%Y")) as masa_berakhir,

                ifnull((SELECT DATE_FORMAT(create_at, "%d-%m-%Y %H:%i") FROM log_calon_user WHERE id_calon_user = a.id AND status='New' ORDER BY id DESC LIMIT 1),'') AS new_tanggal,
                ifnull((SELECT keterangan FROM log_calon_user WHERE id_calon_user = a.id AND status='New' ORDER BY id DESC LIMIT 1),'') AS new_keterangan,

                ifnull((SELECT DATE_FORMAT(create_at, "%d-%m-%Y %H:%i") FROM log_calon_user WHERE id_calon_user = a.id AND status='Middle' ORDER BY id DESC LIMIT 1),'') AS middle_tanggal,
                ifnull((SELECT keterangan FROM log_calon_user WHERE id_calon_user = a.id AND status='Middle' ORDER BY id DESC LIMIT 1),'') AS middle_keterangan,

                ifnull((SELECT DATE_FORMAT(create_at, "%d-%m-%Y %H:%i") FROM log_calon_user WHERE id_calon_user = a.id AND status='Hot' ORDER BY id DESC LIMIT 1),'') AS hot_tanggal,
                ifnull((SELECT keterangan FROM log_calon_user WHERE id_calon_user = a.id AND status='Hot' ORDER BY id DESC LIMIT 1),'') AS hot_keterangan,

                ifnull((SELECT DATE_FORMAT(create_at, "%d-%m-%Y %H:%i") FROM log_calon_user WHERE id_calon_user = a.id AND status='Closing' ORDER BY id DESC LIMIT 1),'') AS closing_tanggal,
                ifnull((SELECT keterangan FROM log_calon_user WHERE id_calon_user = a.id AND status='Closing' ORDER BY id DESC LIMIT 1),'') AS closing_keterangan,

                ifnull((SELECT DATE_FORMAT(create_at, "%d-%m-%Y %H:%i") FROM log_calon_user WHERE id_calon_user = a.id AND status='Lose' ORDER BY id DESC LIMIT 1),'') AS lose_tanggal,
                ifnull((SELECT keterangan FROM log_calon_user WHERE id_calon_user = a.id AND status='Lose' ORDER BY id DESC LIMIT 1),'') AS lose_keterangan

            FROM ${table} a
            WHERE a.id_user = '${idUser}'
        `;

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
        if (status) {
            query += ` AND status = '${status}'`
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
    async cekNoHp(nohp, id_edit='') {
        let data = true;

        let where_edit = '';
        if(id_edit != '') {
            where_edit = ` AND id <> '${id_edit}'`
        }

        let query = `
            SELECT id
            FROM ${table} WHERE nohp = '${nohp}' ${where_edit}`

        let rows = await modelHelper.getRowsQuery(connection, query)

        if (rows) {
            if (rows.length > 0) {
                data = false
            }
        }

        return data
    }
}