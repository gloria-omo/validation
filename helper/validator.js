const joi = require("joi")

const myValidation = joi.object({
    firstName:joi.string().min(3).max(10),
    lastName:joi.string().min(3).max(10),
    email:joi.string().email(),
    number:joi.string().pattern(new RegExp('^[0-9]')).min(5).max(11),
    password:joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))

})

module.exports = {myValidation}
