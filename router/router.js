const express = require("express")
const router = express.Router()
const {home,createUser,verify, logIn, updateUser, logOut, getOne} = require("../controller/controller")
const authenticate = require("../middleware/authorization")

router.get("/",home)

router.post("/newUser",createUser)

router.put("/verify/:id/:userToken",verify)

router.post("/login",logIn)

router.put("/updateuser/:id/:token", authenticate,updateUser)

router.put("/logout/:id",logOut)

router.get("/getone/:id",getOne)



module.exports = router