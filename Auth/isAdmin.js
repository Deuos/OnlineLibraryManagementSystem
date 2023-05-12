const express = require('express')
//User Schema
const User = require('../Models/user')

module.exports = (req, res, next) => {

    console.log(req.token.userRole)

    if (req.token.userRole === "User") {

        return res.status(401).json({ sucess: false, message: "You are not authorized" })
    }
    next()
}