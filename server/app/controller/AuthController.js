
const httpStatusCode = require("../helper/httpStatusCode");
const { hashedPassword, comparePassword } = require("../middleware/auth");
const userModel = require("../model/user");
const jwt=require('jsonwebtoken')
const fs=require('fs').promises
const path=require('path')
class AuthController {

    async register(req, res) {
        try {
            //console.log(req.body);
            const { name, email, password, phone } = req.body

            if (!name || !email || !password || !phone) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "All fields are required"
                })
            }
            //check for dublicate email
            const isExistingUser = await userModel.findOne({ email })
            if (isExistingUser) {
                return res.status(httpStatusCode.Conflict).json({
                    status: false,
                    message: "email already exist"
                })
            }

            if (name.length < 3 || name.length > 30) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "Name must be within 3 to 30  characters"

                })
            }

            if (!/^\d{10}$/.test(phone)) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "Phone must be of 10 digits"
                })
            }

            const hashed = hashedPassword(password)

            const userData = new userModel({
                name, email, password: hashed, phone
            }

            )
           console.log("req.file",req.file)
            if(req.file){
                userData.image=req.file.path
            }

            const data = await userData.save()
            return res.status(httpStatusCode.Create).json({
                status: true,
                message: "user created successfully",
                data: data
            })
        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            })
        }

    }


    async login(req,res){
        try{
            const {email,password}=req.body
            if(!email || !password){
                return res.status(httpStatusCode.BadRequest).json({
                    status:false,
                    message:"All fileds are required"
                })
            }

            const user=await userModel.findOne({email})
            if(!user){
                return res.status(httpStatusCode.BadRequest).json({
                    status:false,
                    message:"user not found"
                })
            }
            const ismatch= comparePassword(password,user.password)
            if(!ismatch){
                return res.status(httpStatusCode.BadRequest).json({
                    status:false,
                    message:"invalid password"
                })
            }
             const token= jwt.sign({
                _id:user._id,
                name:user.name,
                email:user.email,
                image:user.image
             },process.env.JWT_SECRET_KEY,{expiresIn:"2h"})
              
             return res.status(httpStatusCode.Ok).json({
                    status:true,
                    message:"user login successfully",
                    user:{
                        _id:user._id,
                        name:user.name,
                        email:user.email,
                        image:user.image
                    },
                    token:token
                })


        }catch(error){
            console.log(error);
            
        }
    }


    async dashboard(req,res){
        try{
             return res.status(httpStatusCode.Ok).json({
                    status:true,
                    message:"Welcome to user dashboard",
                    data:req.user
                })

        }catch(error){
            console.log(error);
            
        }
    }
    async profile(req,res){
        try{
             return res.status(httpStatusCode.Ok).json({
                    status:true,
                    message:"Welcome to user profile",
                    data:req.user
                })

        }catch(error){
            console.log(error);
            
        }
    }
}


module.exports = new AuthController()