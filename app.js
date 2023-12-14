const express = require("express")
const app = express()
app.use(express.json())
const router = require("./router/router")
app.use(router)
require("dotenv").config()
const port = process.env.port
const db = process.env.dbLink
const mongoose = require("mongoose") 

mongoose.connect(db).then(()=>{
console.log("database connected successfully")
app.listen(port,()=>{
   console.log(`server is listening to port:${port}`)     
})
}).catch(()=>{
console.log("unable to connect")
})
