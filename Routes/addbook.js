const express = require('express')
const Book = require('../Models/book')

const addBook = express.Router();

addBook.get('/', async (req, res) => {

    res.render('addBook', {msg: ""})
    //res.send({message: "verfied"})
  });

addBook.post('/', async (req, res) => {

    let msg = ""

    try {
    // Create a new book document using the request body
    const newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        genre: req.body.genre,
        year: req.body.year,
    });

    // Save the new book document to the MongoDB collection
    await newBook.save();
    // Redirect the user to the home page
    msg = "Book added successfully"
    res.render('addBook', { msg: msg });

    } catch (err) {
    console.error(err);
    msg = "Error adding book"
    res.status(500).render('addBook', {msg: msg});
    }
});

module.exports = addBook