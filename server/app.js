
const express = require("express")
const ejs = require("ejs")
const dbCon = require('./app/config/dbCon')
const cors = require("cors")
const methodOverride = require('method-override');
const path = require('path')
const dotenv = require('dotenv').config()
const bodyParser=require('body-parser')

 
 const app=express()

 app.set("view engine","ejs")
 app.set("views","views")



 dbCon()
 app.use(cors())
 app.use(express.json())
//middleware
app.use(express.urlencoded({ extended: true }))
// app.use(bodyParser.urlencoded(
//     {
//         limit:'100mb',
//         parameterLimit:"2000"
//     }
// ))
// app.use(bodyParser.json({
//         limit:'100mb',
//         parameterLimit:"2000"
//     }))


//method override
app.use(methodOverride('_method'));

 app.use(express.static(__dirname + '/public'));
 app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
 app.use('/uploads/users', express.static(path.join(__dirname, 'uploads/users')))
 //routes
const ProductApiRoute=require('./app/routes/productApiRoute')
app.use('/api',ProductApiRoute)
//users auth route

const authRoute=require('./app/routes/authRoute')
app.use('/api',authRoute)
const port=3005

app.listen(port,()=>{
console.log("server running at port :",port)
})