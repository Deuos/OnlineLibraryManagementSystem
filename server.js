const express = require("express")
//Password Hasher, Cookies, JWT web token
const bcrypt = require("bcrypt")
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
//Models
const Book = require('./Models/book');
const User = require('./Models/user');
const Checkout = require('./Models/bookCheckout');
const CheckoutHistory = require('./Models/bookCheckoutHistory')

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
app.use("/public", express.static(__dirname + "/Views/public"));

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
const viewBooks = require("./Routes/books.js");
const mylist = require("./Routes/mylist");
const userCart = require("./Routes/userCart");
const viewbooksProfile = require("./Routes/viewbooksProfile");

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
//Checkout books
app.post('/checkout/:id', auth, async (req, res) => {

  try {
 
    emailUser = req.token.userEmail;
    idUser = req.token.userID
  
    console.log(emailUser)
    console.log(idUser)
  

    // Find the book by id
    const book = await Book.findById(req.params.id);
    if (!book) {
      return console.log("book not found");
    }

    //Create a new checkout
    const checkout = new Checkout({
      user: emailUser,
      book: book.title,
      bookid: book._id,
      checkoutDate: new Date(Date.now()),
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Return date is 7 days from now
    });
    await checkout.save();
    //Save in history
    const checkoutHistory = new CheckoutHistory({
      user: emailUser,
      book: book.title,
      bookid: book._id,
      checkoutDate: new Date(Date.now()),
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Return date is 7 days from now
    })

    // Save the checkout to the database
    await checkoutHistory.save()
    book.status = "Yes";
    await book.save();
    console.log("Book status updated to Yes");
    // Return the checkout object
    console.log(JSON.stringify(checkout))
    res.redirect('/profile')
  } catch (error) {
    console.error(error);
    res.redirect('/profile')
    // res.status(500).json({ message: 'Internal server error' });
  }
})
app.use('/userCart', auth, userCart)
//My List
app.use('/mylist', auth, mylist)
//View books for profile user//Filters status
app.use('/booksProfile', auth, viewbooksProfile)

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
    console.log("Book status updated to Yes");
    res.redirect('/add-book')
    console.log("Deleted book successfully")
  } catch (err) {
    console.error(err);
    res.redirect('/add-book')
    console.log("Error deleting book")
  }
})

app.get('/return/:id', auth, async(req, res) => {
  try {



    const checkoutbookid = await Checkout.findById(req.params.id)
    console.log(checkoutbookid.bookid)

    const books = await Book.findById(checkoutbookid.bookid)
    console.log(books)
    console.log(books.status)
    
    books.status = "No"
    await books.save()

    //delete book from checkout
    await Checkout.findByIdAndDelete(req.params.id)
  
    
    res.redirect('/userCart')
    console.log("Successfully Returned")
  } catch (err) {
    console.log(err)
    res.redirect('/userCart')
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