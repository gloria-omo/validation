const jwt = require("jsonwebtoken")
const userModel = require("../model/model")
require("dotenv").config()

const authenticate = async(req,res,next)=>{
    try{
        const token = req.params.token;

        const decodedToken =jwt.verify(token,process.env.jsonSecret) 

        const user = await userModel.findById(decodedToken.userId)

        if (!user){
        return res.status(404).json({
                message: "authentication failed: user not found"
            })
        }

        if (user.token === null){
            return res.status(401).json({
                message:"user logged out"
            })
        }

        next()
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

module.exports = authenticate