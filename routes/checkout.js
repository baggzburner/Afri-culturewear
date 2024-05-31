const express = require("express");
const router = express.Router();
const db = require("../models/connection"); // Import the database connection module

router.get('/checkout', (req, res) => {
    const cart = req.session.cart || [];
    res.render('checkout', { cart });
});

router.post('/checkout', (req, res) => {
    const { fullName, email, phone, address, city, state, zip } = req.body;
  
    const cart = req.session.cart || [];
  
    const orderDetails = cart.map(item => ({
      productName: item.name,
      quantity: item.quantity,
      price: item.price
    }));
  
    const orderDetailsJson = JSON.stringify(orderDetails);
  
    const sql = `
      INSERT INTO orders (fullName, email, phone, address, city, state, zip, orderDetails)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [fullName, email, phone, address, city, state, zip, orderDetailsJson];
  
    // Execute SQL query using the database connection
    db.query(sql, values, (error, results, fields) => {
      if (error) throw error;
      console.log('Order placed successfully');
      
      res.send("order made successfully")
    });
});

module.exports = router;
