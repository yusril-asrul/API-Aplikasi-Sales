const { cekAppSecretKey,getDataUserByUsername } = require("../models");
const { decodeToken } = require("./helper");
const { responseError,NeedAuthentication,NotFoundError,Forbidden,Unauthorized } = require("./response")
const urlNotAuthorizationBearer = [
    '/auth/login'
]

const auth = (endpointArray,h)=>{
    let urlName = ''
    switch (endpointArray.length){
        case 2:
            urlName = '/auth';
            if(endpointArray[1] === 'login'){
                urlName += '/login'
            } else {
                return NotFoundError(h);
            }
            break
        default:
            return NotFoundError(h);
    }
    return urlName
}

const calonUser = (endpointArray,h)=>{
    let urlName = ''
    switch (endpointArray.length){
        case 2:
            urlName = '/calon-user';
            break
        default:
            return NotFoundError(h);
    }
    return urlName
}

const urlGenerator = (endpointArray,h) => {
    let urlName = ''
    if (endpointArray[0] === 'auth') {
        urlName = auth(endpointArray,h)
    } else if (endpointArray[0] === 'calon-user') {
        urlName = calonUser(endpointArray,h)
    }
    return urlName
}

const getArrayEndpoint = (url)=>{
    let endpointArray = url.split('/');
    endpointArray.splice(0, 1)
    return endpointArray;
};

const checkConditionNotAuthorizationBearer = (urlName)=>{
    const index = urlNotAuthorizationBearer.indexOf(urlName)
    if (index >= 0) return true
    return false
}

module.exports = async (req,res,next) => {
    try {
        let useToken = false;
        const url = req.url;
        const method = req.method;
        const endpointArray = getArrayEndpoint(url)
        const appKey = req.headers['app-key']
        const appSecret = req.headers['app-secret']
        let user;

        console.log(method+" "+url);


        // ==================== start auth check level i ====================
        
        // Level 1 Auth Check Route
        const urlName = urlGenerator(endpointArray,res);
        if (urlName == '') return NotFoundError(res)
        
        // Level 2 Auth Check App Key
        if (!(appKey && appSecret)) return NeedAuthentication(res);
        const application = await cekAppSecretKey(appKey,appSecret)
        if(application === false) return Forbidden(res)
        
        // Level 3 Auth Check Route registered
        // const applicationEndpoint = await checkUrlEndpoint(method,urlName)
        // if(applicationEndpoint === false) return Forbidden(res)
        
        // Level 4 Auth Check App Key to access Endpoint
        // const applicationAccessEndpoint = await checkAppToAccessEndpoint(application.id,applicationEndpoint.id)
        // if(applicationAccessEndpoint === false) return Forbidden(res)
        
        // ==================== end auth check level i ====================



        // ==================== start auth check level ii ====================

        // level 1 Check Authorization Bearer Token
        if (!checkConditionNotAuthorizationBearer(urlName)){
            useToken = true;
            if(!(req.headers.authorization)) return NeedAuthentication(res)

            const authorizationToken = req.headers.authorization.replace('Bearer ','');
            user = await decodeToken(authorizationToken)
            if (!(await getDataUserByUsername(user.username))) return Unauthorized(res)
        }

        // ==================== end auth check level ii ====================

        req.auth = {
            application,
            user
        }

        next();
    } catch(error){
        return responseError(res,error,500)
    }    
}