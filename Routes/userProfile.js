const express = require('express')

const userProfile = express.Router();

userProfile.get('/', async (req, res) => {

  //renders profile from views/ejs
    res.render('profile')
  });


module.exports = userProfile