const express = require("express");
const router = express.Router();
const db = require("../models/connection"); // Adjust the path to your database connection file
const ensureAuthenticated = require("../middleware/middleWare")
// Render contact form
router.get("/contacts", (req, res) => {
    res.render("contacts");
});

// Handle form submission
router.post("/send-message",ensureAuthenticated,(req, res) => {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
        return res.status(400).send('All fields are required');
    }

    const sql = 'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, subject, message], (err, result) => {
        if (err) throw err;
        console.log('Message inserted:', result.insertId);
        res.redirect('/thank-you');
    });
});

router.get("/thank-you", (req, res) => {
    res.render('message');
});

module.exports = router;
