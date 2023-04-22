const express = require("express")

//Password Hasher, Cookies, JWT web token
const bcrypt = require("bcrypt")
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const Book = require('./Models/book');

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
const adminDashboard = require("./Routes/adminProfile.js")
const addBook = require("./Routes/addbook.js")
const viewBooks = require("./Routes/books.js")
//const deleteBook = require("./Routes/deletebook.js")

//port 
const port = 8080;

/******Views******/
//Login - HomePage
app.use('/', Login)
//Register
app.use('/register', Register)
/*****USER******/
//userProfile
//auth makes it so no one can access the route without a verfied cookie
app.use('/profile', auth, userProfile)
/*****USER******/

/*****ADMIN******/
//admin-dashboard
app.use('/admin-dashboard', auth, adminDashboard)
//add-book
app.use('/add-book', auth, addBook)
//Delete books
app.get('/delete/:id', auth, async (req, res) => {
    var uid = req.params.id;
    console.log(uid)
   try {
    // Find the book by ID and delete it
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/add-book')
    console.log("Deleted book successfully")
  } catch (err) {
    console.error(err);
    res.redirect('/add-book')
    console.log("Error deleting book")
  }
})
//View books
app.use('/books', auth, viewBooks)
/*****ADMIN******/
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