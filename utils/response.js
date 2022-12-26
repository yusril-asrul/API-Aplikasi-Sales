const NotFoundError = (h)=>{
    const code = 404
    const message = '404 Page not found'
    const response = createReponse(false,message)
    return h.status(code).json(response)
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
    NotFoundError,
    responseError
  }