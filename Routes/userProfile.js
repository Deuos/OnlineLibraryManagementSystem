const express = require('express')

const userProfile = express.Router();

userProfile.get('/', async (req, res) => {

    res.render('profile')
    //res.send({message: "verfied"})
  });


module.exports = userProfile