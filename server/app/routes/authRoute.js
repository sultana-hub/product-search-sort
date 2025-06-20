const express=require("express")
const AuthController=require("../controller/AuthController")
const UsersImageUploads=require('../helper/userImageUpload')
const router=express.Router()

router.post("/login",AuthController.login)
router.post("/register",UsersImageUploads.single('image'),AuthController.register)
router.get("/dashboard",AuthController.dashboard)
router.get("/profile",AuthController.profile)
module.exports=router