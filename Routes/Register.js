const express = require('express')
const bcrypt = require('bcrypt')

//User Schema
const User = require('../Models/user.js')

//Router
const Register = express.Router();

//Register View
Register.get('/', (req, res, next) => {

    //Register ejs//FORM for login
    res.render('register')
})
//Register Form
Register.post('/', (req, res) => {
    
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

        })

})

//Exports Register to Server.js
module.exports = Register