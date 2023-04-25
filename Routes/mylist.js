const express = require('express');
const Checkout = require('../Models/bookCheckout');
const mylist = express.Router();

mylist.get('/', async (req, res) => {
  
    console.log(req.token.userEmail)

    // Get the list of all checkouts
    const checkouts = await Checkout.find();

    // Create a new array to store the matching checkouts
    const matchingCheckouts = [];

    // Loop through the checkouts
    for (const checkout of checkouts) {
      // Check if the useremail matches the email from the req.JSON
      if (checkout.user === req.token.userEmail) {
        // Add the checkout to the matchingCheckouts array
        matchingCheckouts.push(checkout);
      }
    }

    // If there are any matching checkouts, send a new JSON with the matching checkouts
    if (matchingCheckouts.length > 0) {
        console.log(matchingCheckouts)
      res.json(matchingCheckouts)
    } else {
      res.send('There are no books you checked out.');
    }
})


module.exports = mylist;