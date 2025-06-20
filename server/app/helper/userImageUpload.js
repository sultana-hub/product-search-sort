const multer=require('multer')
const fs=require('fs')
const path=require('path')


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/users')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+'-'+file.originalname)
    }
})

const UsersImageUploads=multer({storage:storage})

module.exports=UsersImageUploads