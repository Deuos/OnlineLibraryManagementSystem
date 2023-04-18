const express = require('express')

const adminDashboard = express.Router();

adminDashboard.get('/', async (req, res) => {

    res.render('adminDashboard')
    //res.send({message: "verfied"})
  });


module.exports = adminDashboard