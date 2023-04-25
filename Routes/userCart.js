const express = require('express')

const userCart = express.Router();

userCart.get('/', (req, res) => {

    res.render('mylist')
    //res.send({message: "verfied"})
  });


module.exports = userCart