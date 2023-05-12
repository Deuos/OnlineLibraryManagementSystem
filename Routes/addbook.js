const express = require('express')
const Book = require('../Models/book')

const addBook = express.Router();

addBook.get('/', async (req, res) => {
    res.render('addBook')
    //res.send({message: "verfied"})
});

addBook.post('/', async (req, res) => {

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
        res.redirect('/add-book')

    } catch (err) {
        console.error(err);
        res.redirect('/add-book')
    }
});

module.exports = addBook