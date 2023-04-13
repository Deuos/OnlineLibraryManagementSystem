const express = require("express")
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
//Cookies and Password Hasher
const session = require("express-session")
const bcrypt = require("bcrypt")
//Mongodb
const mongoose = require("mongoose")
//.env
const env = require('dotenv').config()

//Intilize express
const app =  express()

//Middleware
app.use(express.json())
//EJS
app.set('view engine','ejs'); 
//Connection to monogdb
const dbConnect = require("./Database/databaseConnection.js")
dbConnect()

//get user Model
const User = require('./Models/user.js')
//JWT token check
const auth = require('./Auth/auth.js')
const port = 8080;

//Views
//Home/Login
app.get('/', (req, res) => {

    res.render('login');
})

//Login 
app.post('/', (req, res, err) => {

    User.findOne({ email: req.body.email })

        //if email exists
        .then((user) => {
            // compare the password entered with the hashed password found
            bcrypt.compare(req.body.password, user.password)
                //if the passwords match
                .then((passwordCheck) => {
                    //check if password matches
                    if (!passwordCheck) {
                        return res.status(400).send({
                            message: "Password does not match",
                            err,
                        })
                    }
                    //create a JWT token that expires in 24 hours
                    const token = jwt.sign(
                        {
                            userID: user._id,
                            userEmail: user.email,
                        },
                        process.env.JWT_TOKEN,//Change to "RANDOM-TOKEN"
                        { expiresIn: "24h" }
                    )
                    //return success response if email and password matched
                    return res.status(200).send({
                        message: "Login Successful",
                        email: user.email,
                        token,
                    })
                })
                //catches the error if the password doesn't match
                .catch((err) => {
                    res.status(400).send({
                        message: "Password does not match",
                        err,
                    })
                })
        })
        //catch error if email does not exist
        .catch((err) => {

            res.status(404).send({
                message: "Email not found",
                err,
            })
        })

})

//Register
app.get('/register', (req, res, next) => {

    //Register ejs//FORM for login
    res.render('register')
})

app.post('/register', (req, res) => {
    
    console.log(req.body)
    
    bcrypt.hash(req.body.password, 10)
        .then((hashPassword) => {

            const user = new User({

                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashPassword,
            })

            user
                .save()
                .then((result) => {

                    res.status(201).send({
                        message: "User Created",
                        result,
                    })
                })
                .catch((err) => {
                    res.status(501).send({
                        message: "Error creating User",
                        err
                    })
                })
        })
        .catch((err) => {

            res.status(500).send({
                message: "Password not hashed",
                err
            })
        })

})

app.get('/profile', auth, (req, res) => {

    res.send("you are authorized")
})

app.listen(port, () => {

    console.log("Connected on", port)
})