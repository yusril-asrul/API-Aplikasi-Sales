const JWT = require("jsonwebtoken");
const { jwtSecret } = require('../config/app')

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
    generateCode,generateToken,decodeToken,nextAdd,nextEdit
}