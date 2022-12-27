const NotFoundError = (h)=>{
    const code = 404
    const message = 'Page not found.'
    const response = createReponse(false,message)
    return h.status(code).json(response)
}

const Forbidden = (h) => {
    const response = createReponse(false,"Forbidden. You don't have permission.")
    return h.status(403).json(response)
}

const Unauthorized = (h) => {
    const response = createReponse(false,"Unauthorized Error.")
    return h.status(401).json(response)
}

const NeedAuthentication = (h) => {
    const response = createReponse(false,"Need Authentication.")
    return h.status(401).json(response)
}

const responseSuccess = (h,message,data={})=>{
    const response = createReponse(false,message,data)
    return h.status(200).json(response)
}

const responseError = (h,error,code)=>{
    const response = createReponse(false,"Server Error "+code,{error : error.message})
    return h.status(code).json(response)
}

const createReponse = (status,message,data={})=>{
    return {
        success : status,
        message : message,
        data : data
    }
}

  module.exports = {
    Forbidden,
    NotFoundError,
    responseError,
    createReponse,
    responseSuccess,
    NeedAuthentication,
    Unauthorized
  }