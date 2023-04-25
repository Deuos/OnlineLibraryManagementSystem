const express = require('express')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const SECRET_KEY = process.env.JWT_TOKEN

const auth = async (req, res, next) => {

    try {

        //const token = await req.header('Authorization')?.replace('Bearer ', '')

        const token = req.cookies.access_token;

        if(!token) {

            throw new Error()
        }
        
        const decoded = await jwt.verify(token, SECRET_KEY)
        req.token = decoded
        // req.id = decoded._id
        req.email = decoded.email
        next()
    }
    catch (err) {

        res.status(401).redirect('/')
    }
}

module.exports = auth