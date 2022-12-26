let bcrypt = require("bcryptjs");

module.exports = {
    hashPassword(password){
        let salt = bcrypt.genSaltSync()
        let hash = bcrypt.hashSync(password, salt)
        return hash;
    },
    adjustmentPassword(salt,password){
        let hash = bcrypt.compareSync(password, salt);
        return hash;
    },
}