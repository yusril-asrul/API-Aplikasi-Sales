const { loadDataRegistrasi, simpanUpdateRegistrasi, loadDataAktifitas, hapusAktifitas } = require('../models');
const { today } = require('../utils/helper');
const {responseError,responseSuccess} = require('../utils/response');

const load = async function(req,res){
    try {
        let id = req.params.id ? req.params.id : '';
        const {cari,first_date,last_date} = req.body

        const kodeReferral = req.auth.user.kode_referral
        let data = await loadDataRegistrasi(kodeReferral,cari,first_date,last_date);
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
        const {id,status,keterangan} = req.body
        
        let message = 'Berhasil Update Status'
        let data = {
            status
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
        }

        let jns = "EDIT";
        await simpanUpdateRegistrasi(jns,table="registrasi",data,id,'id')

        return responseSuccess(res,message)
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

const update_demo = async function(req,res){
    try {
        const {id,demo} = req.body
        
        let message = 'Berhasil Update Demo'
        let data = {
            demo
        }

        let jns = "EDIT";
        await simpanUpdateRegistrasi(jns,table="registrasi",data,id,'id')

        return responseSuccess(res,message)
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

const load_aktfitas = async function(req,res){
    try {
        let id = req.params.id ? req.params.id : '';
        const {id_registrasi} = req.body

        const kodeReferral = req.auth.user.kode_referral
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

module.exports = {load, update_status, update_demo, load_aktfitas, simpan_aktifitas, hapus_aktiftas, update_status_aktifitas}