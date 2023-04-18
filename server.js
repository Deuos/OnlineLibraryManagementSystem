const express = require("express")

//Password Hasher, Cookies, JWT web token
const bcrypt = require("bcrypt")
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

//Mongodb
const mongoose = require("mongoose")

//.env
const env = require('dotenv').config()

//Intilize express
const app =  express()

//Middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.json())
app.use(cookieParser());

//EJS renders .ejs files from views 
app.set('view engine','ejs'); 

//Connection to monogdb
const dbConnect = require("./Database/databaseConnection.js")
dbConnect()

//JWT token check
const auth = require('./Auth/auth.js')
//Routes
const Register = require("./Routes/Register.js")
const Login = require("./Routes/login.js")
const userProfile = require("./Routes/userProfile.js")

//port 
const port = 8080;

/******Views******/
//Login - HomePage
app.use('/', Login)
//Register
app.use('/register', Register)
//userProfile
//auth makes it so no one can access the route without a verfied cookie
app.use('/profile', auth, userProfile)
//logout
app.get('/logout', auth, (req, res) => {
    //Clears Cookies
    res.clearCookie("access_token")
    //Redirects to Login - Homepage
    .redirect('/')
})
/******Views******/

//Localhost 8080
app.listen(port, () => {

    console.log("Connected on", port)
})