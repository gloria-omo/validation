const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName:{
        type:String
    },
lastName:{
    type:String
},
    email:{
        type:String,
        unique:true
    },
    number:{
        type:Number
    },
    password:{
        type:String
    },
    token:{
        type:String
    },
    isVerified:{

        type:Boolean,
        default:false

    }
},{timestamps:true})

const userModel = mongoose.model("userVal",userSchema)

module.exports = userModel