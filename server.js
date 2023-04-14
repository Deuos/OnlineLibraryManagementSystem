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

/* Models */
//get user Model
const User = require('./Models/user.js')
//JWT token check
const auth = require('./Auth/auth.js')
//port 
const port = 8080;

//Views
//Home/Login
app.get('/', (req, res) => {

    //renders login.ejs
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
                        //redirects to /
                        return res.status(400).redirect('')
                        // return res.status(400).send({
                        //     message: "Password does not match",
                        //     err,
                        // })
                    }
                    //create a JWT token that expires in 24 hours
                    const token = jwt.sign(
                        {
                            userID: user._id,
                            userEmail: user.email,
                        },
                        process.env.JWT_TOKEN
                    )

                    //Create cookie set the cookie experies in 24 hours and redirects to /profile
                    return res.cookie('access_token', token, {
                        httpOnly: true,
                        maxAge: 24 * 60 * 60 * 1000, // 24 hours
                    }).status(200)
                    .redirect('profile');

                })
                //catches the error if the password doesn't match
                .catch((err) => {
                    //redirects to /
                    res.status(400).redirect('/')
                    // res.status(400).send({
                    //     message: "Password does not match",
                    //     err,
                    // })
                })
        })
        //catch error if email does not exist
        .catch((err) => {
            //redirects to /
            res.status(404).redirect('/')
            // res.status(404).send({
            //     message: "Email not found",
            //     err,
            // })
        })

})

//Register
app.get('/register', (req, res, next) => {

    //Register ejs//FORM for login
    res.render('register')
})

app.post('/register', (req, res) => {
    
    console.log(req.body)
    //Hashes password using bcrypt
    bcrypt.hash(req.body.password, 10)
        .then((hashPassword) => {

            const user = new User({
                //creates new User using the following
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashPassword,
            })

            user
                .save()
                .then((result) => {

                    res.status(201).redirect('/')
                    // res.status(201).send({
                    //     message: "User Created",
                    //     result,
                    // })
                })
                .catch((err) => {

                    res.status(501).redirect('register')
                    // res.status(501).send({
                    //     message: "Error creating User",
                    //     err
                    // })
                })
        })
        .catch((err) => {

            res.status(500).redirect('register')
            // res.status(500).send({
            //     message: "Password not hashed",
            //     err
            // })
        })

})

//logout
app.get('/logout', auth, (req, res) => {

    res.clearCookie("access_token")
    .status(200)
    .redirect('/')
})

//auth makes it so no one can access the route without a verfied cookie
app.get('/profile', auth, async (req, res) => {

    res.render('profile')
    //res.send({message: "verfied"})
  });

//Localhost 8080
app.listen(port, () => {

    console.log("Connected on", port)
})