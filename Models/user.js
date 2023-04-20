const mongoose = require('mongoose')

const Schema = mongoose.Schema

//Schema for Mongodb, Requires Email and Password
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
        require: [true, "Please Provide a Password"],
        unique: false
    },
    role: {
        type: String,
        default: "User"
    }
})

User = mongoose.model('User', userSchema)

module.exports = User;