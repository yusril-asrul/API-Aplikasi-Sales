const { NotFoundError } = require('../utils/response');
module.exports = function(app){
    app.use("/auth",require("./auth"));
    app.use((req,res)=>NotFoundError(res))
}