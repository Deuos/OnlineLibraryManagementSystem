const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//User Schema
const User = require('../Models/user.js')

//Router
const Login = express.Router();
const Logout = express.Router();

//Home/Login Views
Login.get('/', (req, res) => {

    //renders login.ejs
    res.render('login');
})

//Login Form 
Login.post('/', (req, res, err) => {

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


//Exports Login to Server
module.exports = Login