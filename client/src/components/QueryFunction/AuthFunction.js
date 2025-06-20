import axiosInstance from "../../api/axiosInstance";
import { endPoints } from '../../api/api-url';

export const userRegister=async(newUser)=>{
const res=await axiosInstance.post(endPoints.register,newUser,{
    headers: {
    "Content-Type": "multipart/form-data"
  }
})
console.log("register user query:",res)
return res.data
}

export const userLogin=async(credentials)=>{
const res=await axiosInstance.post(endPoints.login,credentials,{
    headers:{
        'Content-Type':"application/json"
    }
})
console.log("user credentials",res)
return res.data
}