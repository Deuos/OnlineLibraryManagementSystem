const mongoose = require('mongoose');

const Book = require('./book')
const User = require('./user')

const Schema = mongoose.Schema

checkoutSchema = new Schema({
    book: {
        type: String,
        ref: Book,
        required: true
    },
    bookid: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        ref: User,
        required: true
    },
    checkoutDate: {
        type: String,
        required: true
    },
    returnDate: {
        type: String,
        required: true
    },
    returnedDate: {
        type: String
    }
});

checkout = mongoose.model('checkout', checkoutSchema);

module.exports = checkout;