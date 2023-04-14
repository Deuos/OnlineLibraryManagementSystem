const mongoose = require('mongoose')
const dotenv = require("dotenv")

dotenv.config()

const databaseURL = process.env.DB_URL

async function dbConnect() {
    

    //Connects to monogdb thru databaseURL
    mongoose
        .connect(
            databaseURL,
            {
            
            }
        )
        .then(() => {
            console.log("Connected to Monogodb")
        })
        .catch((error) => {
            console.log("Connection Failed")
            console.log(error)
        })
}

module.exports = dbConnect