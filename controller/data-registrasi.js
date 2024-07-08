const { loadDataRegistrasi, simpanUpdateRegistrasi, cekDataRegistrasi, loadDataAktifitas, hapusAktifitas, loadDataKebutuhan, hapusKebutuhan } = require('../models');
const { today } = require('../utils/helper');
const {responseError,responseSuccess} = require('../utils/response');

const load = async function(req,res){
    try {
        let id = req.params.id ? req.params.id : '';
        const {cari,first_date,last_date,status} = req.body

        const kodeReferral = req.auth.user.kode_referral
        let data = await loadDataRegistrasi(kodeReferral,cari,first_date,last_date,status);
        if (data){
            return responseSuccess(res,'Loaded.',data)
        } else {
            return responseSuccess(res,'data not found.',{},false)
        }
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

const update_status = async function(req,res){
    try {
        const {id,id_registrasi_booble,status,keterangan,status_aktif,tgl_aktif,nominal_closing} = req.body

        let id_registrasi = await cekDataRegistrasi(id_registrasi_booble);
        
        let message = 'Berhasil Update Status'
        let data = {
            status
        }

        if(id_registrasi == false){
            data.id_registrasi_booble = id_registrasi_booble
        }

        if (status == "Follow Up"){
            data.ket_follow_up = keterangan
            data.update_follow_up = today()
        }
        if (status == "Prospek"){
            data.ket_prospek = keterangan
            data.update_prospek = today()
        }
        if (status == "Closing"){
            data.ket_closing = keterangan
            data.update_closing = today()
            data.status_aktif = status_aktif
            data.tgl_aktif = tgl_aktif
            data.nominal_closing = nominal_closing
        }

        let jns = "EDIT";
        if(id_registrasi == false){
            jns = "ADD";
        }
        await simpanUpdateRegistrasi(jns,table="registrasi",data,id_registrasi,'id')

        let id_registrasi_updt = await cekDataRegistrasi(id_registrasi_booble);

        return responseSuccess(res,message,id_registrasi_updt)
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

const update_demo = async function(req,res){
    try {
        const {id,id_registrasi_booble,demo} = req.body

        let id_registrasi = await cekDataRegistrasi(id_registrasi_booble);
        
        let message = 'Berhasil Update Demo'
        let data = {
            demo
        }

        if(id_registrasi == false){
            data.id_registrasi_booble = id_registrasi_booble
        }

        let jns = "EDIT";
        if(id_registrasi == false){
            jns = "ADD";
        }
        await simpanUpdateRegistrasi(jns,table="registrasi",data,id_registrasi,'id')

        let id_registrasi_updt = await cekDataRegistrasi(id_registrasi_booble);

        return responseSuccess(res,message,id_registrasi_updt)
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

const load_aktfitas = async function(req,res){
    try {
        let id = req.params.id ? req.params.id : '';
        const {id_registrasi} = req.body

        let data = await loadDataAktifitas(id_registrasi);
        if (data){
            return responseSuccess(res,'Loaded.',data)
        } else {
            return responseSuccess(res,'data not found.',{},false)
        }
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

const simpan_aktifitas = async function(req,res){
    try {
        const {id_registrasi,aktivitas} = req.body
        const idUser = req.auth.user.id
        
        let message = 'Aktivitas Berhasil Disimpan'
        let data = {
            id_registrasi,
            status: 'New',
            aktifitas : aktivitas,
            create_by: idUser,
            create_at: today()
        }

        let jns = "ADD";
        await simpanUpdateRegistrasi(jns,table="aktifitas",data,id='','id')

        return responseSuccess(res,message)
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

const hapus_aktiftas = async function(req,res){
    try {
        const {id} = req.body

        await hapusAktifitas(id)
        return responseSuccess(res,'Deleted.')
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

const update_status_aktifitas = async function(req,res){
    try {
        const {id,status,keterangan} = req.body
        const idUser = req.auth.user.id
        
        let message = 'Berhasil Update Status'
        let data = {
            status,
            last_user: idUser,
            last_update: today()
        }

        if (status == "Proses"){
            data.ket_proses = keterangan
        }
        if (status == "Gagal"){
            data.ket_gagal = keterangan
        }

        let jns = "EDIT";
        await simpanUpdateRegistrasi(jns,table="aktifitas",data,id,'id')

        return responseSuccess(res,message)
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}


const load_kebutuhan = async function(req,res){
    try {
        let id = req.params.id ? req.params.id : '';
        const {id_registrasi} = req.body

        let data = await loadDataKebutuhan(id_registrasi);
        if (data){
            return responseSuccess(res,'Loaded.',data)
        } else {
            return responseSuccess(res,'data not found.',{},false)
        }
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

const simpan_kebutuhan = async function(req,res){
    try {
        const {id_registrasi,kebutuhan} = req.body
        const idUser = req.auth.user.id
        
        let message = 'Kebutuhan Berhasil Disimpan'
        let data = {
            id_registrasi,
            kebutuhan,
            create_by: idUser,
            create_at: today()
        }

        let jns = "ADD";
        await simpanUpdateRegistrasi(jns,table="kebutuhan",data,id='','id')

        return responseSuccess(res,message)
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

const hapus_kebutuhan = async function(req,res){
    try {
        const {id} = req.body

        await hapusKebutuhan(id)
        return responseSuccess(res,'Deleted.')
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

module.exports = {load, update_status, update_demo, load_aktfitas, simpan_aktifitas, hapus_aktiftas, update_status_aktifitas, load_kebutuhan, simpan_kebutuhan, hapus_kebutuhan}