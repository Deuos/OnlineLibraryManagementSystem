//Title, Author, Year, Genre, Checkout = default [false]
const mongoose = require('mongoose');

const Schema = mongoose.Schema

// Define a schema for the Book collection
bookSchema = new Schema({
  title: { 
    type: String, 
    required: true,
    unique: true,
  },
  author: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  genre: { 
    type: String, 
    required: true 
  },
  year: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    default: "No"
  },
});

// Create a model for the Book collection using the schema
Book = mongoose.model('Book', bookSchema);

module.exports = Book;
