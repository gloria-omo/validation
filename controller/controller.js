const userModel = require("../model/model")
const {myValidation} = require("../helper/validator")
const bcrypt=require("bcrypt")
const sendEmail=require("../helper/email").sendEmail
const jwt=require("jsonwebtoken")
const dynamicEmail=require("../helper/html")
exports.createUser = async (req,res)=>{
try{
   const data = {
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email.toLowerCase(),
    number:req.body.number,
    password:req.body.password
}

await myValidation.validateAsync(data,(err,data)=>{
if(err){
   return res.status(400).json(err.message)
}else{
  return res.status(200).json({
        data:data
    })
}
})


const saltedPassWord=bcrypt.genSaltSync(10)

const hashPassWord=bcrypt.hashSync(data.password,saltedPassWord)
const user = await new userModel(data)
const {lastName,firstName,email}=user
const userToken=await jwt.sign({lastName,firstName,email},process.env.jsonSecret,{expiresIn:"300s"})
 
user.password=hashPassWord
user.token=userToken
await user.save()
const subject='Kindly verify your acct'
const link=`${req.protocol}://${req.get('host')}/updateuser/${user._id}/${user.token}`
// const text=`Hello  ${user.firstName.toUpperCase()}. ${user.lastName.slice(0,1).
//     toUpperCase()}, welcome on board  ,kindly use the below link ${link} to verify your acct. kindly note that this link expires in 5 minutes`

const html=await dynamicEmail(link,user.firstName)


sendEmail({
email:user.email,
subject,
html


})

res.status(200).json({
    message:`user with email ${user.email} is created`,
    data:user
})
}catch(err){
    res.status(500).json(err.message)
}
}

exports.verify = async (req,res)=>{
 try{
 const userToken=req.params.userToken

 await jwt.verify(userToken,process.env.jsonSecret)
    const verify = await userModel.findByIdAndUpdate(req.params.id,{isVerified:true},{new:true})

    // const{firstName,token,_id,...loveth}=verify

    /*
    (err,payLoad)=>{
    if(err){
        res.status(400).json("Link expired")
    }else{
        return payLoad
    }
    }
*/
       res.status(200).json({
        message:`YOU HAVE BEEN VERIFIED`,
         data:verify
    })
 }catch(err){
    res.status(500).json({
        error: err.message
    })
 }
}

exports.logIn = async (req,res)=>{
try{
    const {email,password} =req.body
const userExists = await userModel.findOne({email:email.toLowerCase()})
  if (!userExists){
    return res.status().json({
        massage:"user not found"
    })
  }

  const checkpassword = bcrypt.compareSync(password,userExists.password)
  if (checkpassword === false){
    return res.status(400).json({
        message:"invaild password"
    })
  }
  const userToken = jwt.sign({
    userId:userExists._id,
    email:userExists.email
},process.env.jsonSecret,{expiresIn:"1d"}
    )
    userExists.token = userToken
    const user = await userExists.save()

    res.status(200).json({
        masssage:"logIn successfully",
        data:user
    })
}

catch(err){
    res.status(500).json(err.message)
}
}


exports.updateUser = async(req,res)=>{
    try{
       const id = req.params.id;
       const data ={
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email,
    number:req.body.number
       }

       const user = await userModel.findByIdAndUpdate(id,data ,{new:true});
       res.status(200).json({
        message:"updated succssfully",
        data:user
       })
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

exports.logOut = async (req,res)=>{
    try{
      const id = req.params.id

      const userExists = await userModel.findById(id)
      if(!userExists){
        res.status(404).json({
            message:"user not found"
        })
      }
     userExists.token = null
     await userExists.save()
     res.status(200).json({
        message:"logged out successfully"
     })
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

exports.getOne = async (req,res)=>{
    try{
       const id = req.params.id;

       const user = await userModel.findById(id)

       res.status(200).json({
        message: `user with ${user.email} is found`,
        user
       })

    }
    catch(err){
        res.statu(500).json({
            message:err.message
        })
    }
}

exports.home = (req ,res)=>{
res.json("welcome api")
console.log(req.protocol)
}