const { simpanDataCalonUser, hapusDataCalonUser, loadDataCalonUser, cekNoHp, simpanLogCalonUser, loadJenisFollowUp, loadDataCalonUserExport, loadDataCalonUserLost } = require('../models');
const { randomString, uploadBase64toPhpCI3 } = require('../utils/helper');
const { responseError, responseSuccess } = require('../utils/response');

const load = async function (req, res) {
    try {
        let id = req.params.id ? req.params.id : '';
        const { cari, first_date, last_date, status = null } = req.body

        const idUser = req.auth.user.id
        let data = await loadDataCalonUser(idUser, id, cari, first_date, last_date, status);
        if (data) {
            return responseSuccess(res, 'Loaded.', data)
        } else {
            return responseSuccess(res, 'data not found.', {}, false)
        }
    } catch (error) {
        console.log(error)
        return responseError(res, error, 500);
    }
}

const load_data_lost = async function (req, res) {
    try {
        let data = await loadDataCalonUserLost();
        if (data) {
            return responseSuccess(res, 'Loaded.', data)
        } else {
            return responseSuccess(res, 'data not found.', {}, false)
        }
    } catch (error) {
        console.log(error)
        return responseError(res, error, 500);
    }
}

const load_jns_follow_up = async function (req, res) {
    try {
        let data = await loadJenisFollowUp();
        if (data) {
            return responseSuccess(res, 'Loaded.', data)
        } else {
            return responseSuccess(res, 'data not found.', {}, false)
        }
    } catch (error) {
        console.log(error)
        return responseError(res, error, 500);
    }
}

const export_data = async function (req, res) {
    try {
        let id = req.params.id ? req.params.id : '';
        const { cari, first_date, last_date, status = null } = req.body

        const idUser = req.auth.user.id
        let data = await loadDataCalonUserExport(idUser, id, cari, first_date, last_date, status);
        if (data) {
            return responseSuccess(res, 'Loaded.', data)
        } else {
            return responseSuccess(res, 'data not found.', {}, false)
        }
    } catch (error) {
        console.log(error)
        return responseError(res, error, 500);
    }
}

const hapus = async (req, res) => {
    try {
        let id = req.params.id
        await hapusDataCalonUser(id)
        return responseSuccess(res, 'Deleted.')
    } catch (error) {
        console.log(error)
        return responseError(res, error, 500);
    }
}

const save = async function (req, res) {
    try {
        const { nama_usaha, pemilik_usaha, nohp, alamat, lat, long, foto, jenis_usaha, jenis_user, nominal } = req.body
        const { applikasi_yang_digunakan, lama_tahun, lama_bulan, masa_berakhir, catatan } = req.body
        const idUser = req.auth.user.id
        const jns = req.jenis
        let id_telesales = req.body.id_telesales ? req.body.id_telesales : '';

        if (nohp == '') {
            let data = {};
            return responseSuccess(res, 'Nomor HP Tidak Boleh Kosong.', data, false)
        }

        let validateHp = await cekNoHp(nohp);
        if (jns === "EDIT") {
            validateHp = await cekNoHp(nohp, req.params.id);
        }
        if (!validateHp) {
            let data = {};
            return responseSuccess(res, 'Nomor HP Sudah Terdaftar.', data, false)
        }

        let message = ''
        let data = {
            id_user: idUser,
            nama_usaha, pemilik_usaha, nohp, alamat, jenis_usaha, jenis_user,
            map_lat: lat,
            map_long: long,
            applikasi_yang_digunakan,
            lama_tahun, lama_bulan, masa_berakhir,
            catatan
        }

        if (id_telesales != '') {
            data.id_telesales = id_telesales;
            jns = "EDIT";
        }

        if (nominal !== undefined) {
            data.nominal = nominal;
        }

        if (foto) {
            let filename = randomString(10) + '.jpg';
            await uploadBase64toPhpCI3(filename, foto)
            data.foto = filename
        }

        if (jns === "ADD") {
            await simpanDataCalonUser(jns, data)
            message = 'Created.'
        } else if (jns === "EDIT") {
            let id = req.params.id
            await simpanDataCalonUser(jns, data, id, 'id')
            message = 'Edited.'
        }

        return responseSuccess(res, message)
    } catch (error) {
        console.log(error)
        return responseError(res, error, 500);
    }
}

const update_status = async function (req, res) {
    try {
        const { id, status, keterangan, nominal, follow_up, jenis_follow_up } = req.body
        const idUser = req.auth.user.id

        let message = 'Berhasil Update Status'
        let data = {
            status, keterangan
        }

        if (status == "Closing" && nominal !== undefined) {
            data.nominal = nominal
        }

        let jns = "EDIT";
        await simpanDataCalonUser(jns, data, id, 'id')


        let dataLog = {
            id_calon_user: id,
            status,
            create_by: idUser
        }

        if (keterangan !== undefined) {
            dataLog.keterangan = keterangan;
        }

        if (follow_up !== undefined) {
            dataLog.follow_up = follow_up;
        }

        if (jenis_follow_up !== undefined) {
            dataLog.jenis_follow_up = jenis_follow_up;
        }

        await simpanLogCalonUser('ADD', dataLog, id, 'id')

        return responseSuccess(res, message)
    } catch (error) {
        console.log(error)
        return responseError(res, error, 500);
    }
}

module.exports = { save, hapus, load, update_status, load_jns_follow_up, export_data, load_data_lost }