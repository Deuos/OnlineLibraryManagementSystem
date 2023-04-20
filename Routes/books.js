const express = require('express');
const Book = require('../Models/book');
const viewBooks = express.Router();

viewBooks.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving books' });
  }
});

module.exports = viewBooks;