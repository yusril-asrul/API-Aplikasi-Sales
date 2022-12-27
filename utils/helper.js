const JWT = require("jsonwebtoken");
const { jwtSecret, urlUpload, dirUpload } = require('../config/app')
const request = require('request')

function randomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function uploadBase64toPhpCI3(name,base64){
    return await new Promise((resolve,reject)=>{
            const otpOption = {
                url : urlUpload,
                headers : {'ContentType':'multipart/form-data'},
                method : "POST",
                formData : {
                    dir    : dirUpload,
                    datafile     : base64,
                    filename   : name,
                }
            }
            request(otpOption,function(err,response){
                console.log("UPLOAD FILE ===========|> ",response.body,name)
                if(err) {
                    console.log(err)
                    reject(err);
                }
                resolve(true)
            });
    })
}

function generateToken(obj){
    let dJwt = JWT.sign(obj, jwtSecret, {
        expiresIn: '1d'
   });
    return dJwt
}

async function decodeToken(token){
    return await new Promise((resolve,reject)=>{
        try {
            JWT.verify(token,jwtSecret,async (err,decode)=>{
                if(err) {
                    resolve({})
                    console.log(err)
                }
                resolve(decode)
            })
        } catch(error){
            reject(error)
        }
    });
}




function addZero(i) {
    if (i < 10) { i = "0" + i }
    return i;
}

function randomNumber(length) {
    var result = '';
    var characters = '123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function generateCode(key){
   let d = new Date();
   let thn = d.getFullYear();
   let bulan = addZero(d.getMonth() + 1);
   let tgl = addZero(d.getDate());
   let randNumb = randomNumber(4);
   return `${key}-${thn}${bulan}${tgl}${randNumb}`;
}

function nextAdd(req,res,next){
    req.jenis = "ADD"
    next()
}

function nextEdit(req,res,next){
    req.jenis = "EDIT"
    next()
}

module.exports = {
    generateCode,generateToken,decodeToken,nextAdd,nextEdit,uploadBase64toPhpCI3,randomString
}