const {responseError,responseSuccess} = require('../utils/response');
const save = async function(req,res){
    try {
        const {nama_usaha,pemilik_usaha,nohp,alamat,lat,long,foto} = req.body
        const {applikasi_yang_digunakan,lama_tahun,lama_bulan,masa_berakhir} = req.body
        return responseSuccess(res,"Test")
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

module.exports = {save}