const { simpanDataCalonUser } = require('../models');
const { randomString, uploadBase64toPhpCI3 } = require('../utils/helper');
const {responseError,responseSuccess} = require('../utils/response');
const save = async function(req,res){
    try {
        const {nama_usaha,pemilik_usaha,nohp,alamat,lat,long,foto} = req.body
        const {applikasi_yang_digunakan,lama_tahun,lama_bulan,masa_berakhir} = req.body
        const idUser = req.auth.user.id

        const jns = req.jenis

        let data = {
            id_user : idUser,
            nama_usaha,pemilik_usaha,nohp,alamat,
            map_lat : lat,
            map_long : long,
            applikasi_yang_digunakan,
            lama_tahun,lama_bulan,masa_berakhir,
        }

        if (jns === "ADD"){
            let filename = randomString(10)+'.jpg';
            await uploadBase64toPhpCI3(filename,foto)
            data.foto = filename
            await simpanDataCalonUser(jns,data)
        }

        return responseSuccess(res,"Success.")
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

module.exports = {save}