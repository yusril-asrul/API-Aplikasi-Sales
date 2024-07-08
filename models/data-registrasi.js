const connection = require('../config/database');
const connection_booble = require('../config/database_booble');
const modelHelper = require('./model-helper');
const {dirUpload} = require('../config/app')

module.exports = {
    async simpanUpdateRegistrasi(jns,table,data,id='',key=''){
        let query = await modelHelper.saveRowQuery(connection,table,data,id,jns,key)
        return query
    },
    async loadDataRegistrasi(kodeReferral,cari='',first_date='',last_date=''){
        let data = false;
        let detail = false;

        try {
        
            let drop_tmp = `DROP TEMPORARY TABLE IF EXISTS registrasi_tmp`;
            await modelHelper.getRowsQuery(connection,drop_tmp)

            let create_tmp = `CREATE TEMPORARY TABLE IF NOT EXISTS registrasi_tmp(
                    id INT(11),
                    referral_use VARCHAR(25),
                    tgl DATE,
                    nama VARCHAR(50),
                    email VARCHAR(50),
                    telp VARCHAR(15),
                    kota VARCHAR(100),
                    paket VARCHAR(50)
            )`;
            await modelHelper.runQuery(connection,create_tmp);

            /*
            let del_data_tmp = `TRUNCATE TABLE registrasi_tmp`;
            await modelHelper.runQuery(connection,del_data_tmp)
            */

            let query = `
                SELECT 
                    a.id,
                    a.referral_use,
                    a.tgl,
                    a.nama,
                    a.email,
                    a.telp,
                    a.kota,
                    b.nama as paket
                from registrasi a 
                left join jns_tagihan b on a.jns_tagihan = b.id
                where a.tgl >= '2024-07-04' and a.referral_use <> '' and a.referral_use is not null
                    and a.tgl between '${first_date}' and '${last_date}'
                order by a.tgl desc`;

            let data_regis_booble = await modelHelper.getRowsQuery(connection_booble,query)

            /*
            if (data_regis_booble.length === 0) {
                console.log("Tidak ada data yang diambil dari connection_booble.");
                return data; // Mengembalikan data kosong jika tidak ada data yang diambil
            }
            */

            // Fungsi untuk memformat tanggal ke dalam format yyyy-mm-dd
            function formatDate(date) {
                const d = new Date(date);
                const year = d.getFullYear();
                const month = (`0${d.getMonth() + 1}`).slice(-2);
                const day = (`0${d.getDate()}`).slice(-2);
                return `${year}-${month}-${day}`;
            }

            // Membuat query batch untuk memasukkan data ke tabel sementara
            let values = data_regis_booble.map(row => {
                let formattedDate = formatDate(row.tgl);
                return `(${row.id}, '${row.referral_use}', '${formattedDate}', '${row.nama}', '${row.email}', '${row.telp}', '${row.kota}', '${row.paket}')`;
            }).join(',');

            // Jika data_regis_booble tidak kosong, pastikan values tidak kosong sebelum melanjutkan
            if (values) {
                let insert_tmp = `
                    INSERT INTO registrasi_tmp (id, referral_use, tgl, nama, email, telp, kota, paket) 
                    VALUES ${values}`;
                //console.log("Query insert yang dihasilkan:", insert_tmp);
                await modelHelper.getRowsQuery(connection, insert_tmp);
                //console.log("Data dimasukkan ke tabel sementara registrasi_tmp");
            }

            /*
            for (const row of data_regis_booble) {
                await modelHelper.saveRowQuery(connection, 'registrasi_tmp', row, '', 'ADD', '');
            }
            */

            let query_data_regis = `
                SELECT 
                    b.id,
                    a.id as id_registrasi_booble,
                    DATE_FORMAT(a.tgl, "%d-%m-%Y") as tgl_regis,
                    a.nama,
                    a.email,
                    a.telp,
                    a.kota,
                    a.paket,
                    ifnull(b.demo, '') as demo,
                    ifnull(b.status, 'New') as status
                from registrasi_tmp a 
                left join registrasi b on a.id = b.id_registrasi_booble
                where a.id <>''`

            if (kodeReferral) {
                query_data_regis += ` AND a.referral_use='${kodeReferral}'`
                detail = true
            }
            if(cari) {
                query_data_regis += ` AND (
                    a.nama like '%${cari}%'
                )`
            }
            if(first_date) {
                query_data_regis += ` AND a.tgl between '${first_date}' and '${last_date}'`
            }
            query_data_regis += ` ORDER BY a.id DESC`

            let list_registrasi = await modelHelper.getRowsQuery(connection,query_data_regis)

            if (detail){
                if (list_registrasi.length > 0){
                    data = list_registrasi
                }
            } else {
                data = list_registrasi
            }

        } catch (error) {
            console.error("Error dalam loadDataRegistrasi:", error);
            throw error;
        }

        return data
    },

    async cekDataRegistrasi(id_registrasi){
        let data = false;

        let query = `
            SELECT 
                a.id
            from registrasi a 
            where a.id_registrasi_booble = '${id_registrasi}'`

        let list_registrasi = await modelHelper.getRowsQuery(connection,query)

        if (list_registrasi.length > 0){
            data = list_registrasi[0].id
        }

        return data
    },

    async loadDataAktifitas(id_registrasi){
        let data = false;
        let detail = true; 

        let query = `
            SELECT 
                a.id,
                DATE_FORMAT(date(a.create_at), "%d-%m-%Y") as tgl,
                a.aktifitas as aktivitas,
                a.status,
                if(a.status = 'Proses', a.ket_proses,
                    if(a.status = 'Gagal', a.ket_gagal, '')
                ) as ket_status
            from aktifitas a 
            where a.id_registrasi = '${id_registrasi}'
            order by a.id desc`

        let list_aktifitas = await modelHelper.getRowsQuery(connection,query)


        /*if (detail){
            if (list_aktifitas.length > 0){
                data = list_aktifitas
            }
        } else {*/
            data = list_aktifitas
        //}

        return data
    },
    async hapusAktifitas(id){
        return await modelHelper.deleteById(connection,table='aktifitas',id)
    },
}