
const {responseError} = require('../utils/response');
const login = async function(req,res){
    try {
        const {username,password} = req.body

        
    } catch(error){
        console.log(error)
        return responseError(res,error,500);
    }
}

module.exports = {login}