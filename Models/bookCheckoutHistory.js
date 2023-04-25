const mongoose = require('mongoose');

const Book = require('./book')
const User = require('./user')

const Schema = mongoose.Schema

checkoutHistorySchema = new Schema({
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

checkoutHistory = mongoose.model('checkoutHistory', checkoutHistorySchema);

module.exports = checkoutHistory;