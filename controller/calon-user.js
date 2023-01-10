const { simpanDataCalonUser, hapusDataCalonUser, loadDataCalonUser } = require('../models');
const { randomString, uploadBase64toPhpCI3 } = require('../utils/helper');
const {responseError,responseSuccess} = require('../utils/response');

const load = async (req,res) => {
    let id = req.params.id ? req.params.id : '';
    const idUser = req.auth.user.id
    let data = await loadDataCalonUser(idUser,id);
    if (data){
        return responseSuccess(res,'Loaded.',data)
    } else {
        return responseSuccess(res,'data not found.',{},false)
    }
}

const hapus = async (req,res) => {
    try {
        let id = req.params.id
        await hapusDataCalonUser(id)
        return responseSuccess(res,'Deleted.')
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

const save = async function(req,res){
    try {
        const {nama_usaha,pemilik_usaha,nohp,alamat,lat,long,foto} = req.body
        const {applikasi_yang_digunakan,lama_tahun,lama_bulan,masa_berakhir} = req.body
        const idUser = req.auth.user.id
        const jns = req.jenis


        let message = ''
        let data = {
            id_user : idUser,
            nama_usaha,pemilik_usaha,nohp,alamat,
            map_lat : lat,
            map_long : long,
            applikasi_yang_digunakan,
            lama_tahun,lama_bulan,masa_berakhir,
        }

        if (foto) {
            let filename = randomString(10)+'.jpg';
            await uploadBase64toPhpCI3(filename,foto)
            data.foto = filename
        }

        if (jns === "ADD"){
            await simpanDataCalonUser(jns,data)
            message = 'Created.'
        } else if (jns === "EDIT") {
            let id = req.params.id
            await simpanDataCalonUser(jns,data,id,'id')
            message = 'Edited.'
        }

        return responseSuccess(res,message)
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

const update_status = async function(req,res){
    try {
        const {id,status} = req.body

        let message = 'Berhasil Update Status'
        let data = {
            status : status
        }

        let jns = "EDIT";
        await simpanDataCalonUser(jns,data,id,'id')

        return responseSuccess(res,message)
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

module.exports = {save,hapus,load,update_status}