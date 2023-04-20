const express = require('express')
const bcrypt = require('bcrypt')

//User Schema
const User = require('../Models/user.js')

//Router
const Register = express.Router();

//Register View
Register.get('/', (req, res, next) => {

    //Register ejs//FORM for login
    res.render('register',  {errMsg: ""})
})
//Register Form
Register.post('/', (req, res) => {
    
    //Message to EJS
    let errMsg = ""

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
                    
                })
                .catch((err) => {

                    errMsg = "Email already exists, try a new email."
                    res.status(501).render('register', {errMsg: errMsg})
                    
                })
        })
        .catch((err) => {

            errMsg = "Error hashing password"
            res.status(500).render('register', {errMsg: errMsg})

        })

})

//Exports Register to Server.js
module.exports = Register