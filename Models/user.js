const mongoose = require('mongoose')

const Schema = mongoose.Schema

userSchema = new Schema({

    firstname: String,
    lastname: String,
    email: {
        type: String,
        require: [true, "Please Provide an Email Address"],
        unique: [true, "Email already Exists"]
    },
    password: {
        type: String,
        require: [true, "Please Provude a Password"],
        unique: false
    },
})

User = mongoose.model('User', userSchema)

module.exports = User;