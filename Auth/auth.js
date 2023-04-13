const express = require('express')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const SECRET_KEY = process.env.JWT_TOKEN

const auth = async (req, res, next) => {

    try {

        const token = await req.header('Authorization')?.replace('Bearer ', '')

        if(!token) {

            throw new Error()
        }
        
        const decoded = await jwt.verify(token, SECRET_KEY)
        req.token = decoded

        next()
    }
    catch (err) {

        res.status(401).json({
            err: new Error("invalid request")
        })
    }
}

module.exports = auth