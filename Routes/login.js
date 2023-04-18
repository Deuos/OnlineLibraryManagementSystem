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

            let Admin = false;
            //Checks Admin Status
            if(user.role == "Admin") {

                Admin = true;
            }

            // compare the password entered with the hashed password found
            bcrypt.compare(req.body.password, user.password)
                //if the passwords match
                .then((passwordCheck) => {
                    //check if password matches
                    if (!passwordCheck) {
                        //redirects to /
                        //Password does not match
                        return res.status(400).redirect('')
                    }
                    //create a JWT token that expires in 24 hours
                    const token = jwt.sign(
                        {
                            userID: user._id,
                            userEmail: user.email,
                        },
                        process.env.JWT_TOKEN
                    )

                    let redirectURL = ""
                    if (Admin) {

                        console.log('role', user.roles)
                        redirectURL = "admin-dashboard"
                    } else {

                        redirectURL = "profile"
                    }

                    //Create cookie set the cookie experies in 24 hours and redirects to /profile
                    return res.cookie('access_token', token, {
                        httpOnly: true,
                        maxAge: 24 * 60 * 60 * 1000, // 24 hours
                    }).status(200)
                    .redirect(redirectURL);

                })
                //catches the error if the password doesn't match
                .catch((err) => {
                    //redirects to /
                    //Password does not match
                    res.status(400).redirect('/')
                })
        })
        //catch error if email does not exist
        .catch((err) => {
            //redirects to /
            //Email Not found
            res.status(404).redirect('/')
        })

})


//Exports Login to Server
module.exports = Login