const {getDataUserByUsername} = require('../models/index')
const {responseError,responseSuccess} = require('../utils/response');
const {adjustmentPassword} = require('../utils/encrypt');
const {generateToken} = require('../utils/helper');
const login = async function(req,res){
    try {
        const {username,password} = req.body
        const messageInvalidUserAndPass = "Sory, username or password incorret."
        let data = await getDataUserByUsername(username)
        
        // Cek Username & Password
        if (!data) return responseSuccess(res,messageInvalidUserAndPass,{},false) // Username
        if (!adjustmentPassword(data.salt,password)) return responseSuccess(res,messageInvalidUserAndPass,{},false) // Password

        const token = await generateToken({
            id : data.id,
            username : data.username,
            nama : data.nama,
            nohp : data.nohp,
            email : data.email,
        })

        return responseSuccess(res,"Success Login",{
            token,
            username,
            nama : data.nama,
            nohp : data.nohp,
            email : data.email,
        })
        
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

module.exports = {login}