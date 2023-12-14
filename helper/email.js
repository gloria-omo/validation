const nodemailer=require("nodemailer")
require("dotenv").config()
exports.sendEmail=async(options)=>{
const transporter=nodemailer.createTransport({

service:process.env.service,
auth:{
  user:process.env.user,
  pass:process.env.mailpassword,
  secure:false
}

})

const mailOption={

from:process.env.user,
to:options.email,
subject:options.subject,
html:options.html


}
await transporter.sendMail(mailOption)

}
