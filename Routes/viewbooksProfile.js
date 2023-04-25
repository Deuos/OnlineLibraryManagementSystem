const express = require('express');
const Book = require('../Models/book');
const viewbooksProfile = express.Router();

viewbooksProfile.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    const filteredBooks = books.filter((book) => book.status !== 'Yes');
    res.json(filteredBooks);
    // res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving books' });
  }
});

module.exports = viewbooksProfile;