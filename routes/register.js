const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../models/connection");
const { isValidEmail, isValidPassword } = require("./validation");

const router = express.Router();

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    if (!isValidEmail(email)) {
        res.status(400).send("Invalid email format");
        return;
    }

    if (!isValidPassword(password)) {
        res.status(400).send("Password must be at least 8 characters long and alphanumeric");
        return;
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        const sql = "INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)";
        db.query(sql, [firstname, lastname, email, hashedPassword], (error, result) => {
            if (error) {
                console.log("Error registering user:", error);
                res.status(500).send("Error registering user");
                return;
            }

            console.log('Registration successful');
            res.redirect("/login"); // Redirect to home page after registration
        });
    } catch (error) {
        console.log("Error hashing password:", error);
        res.status(500).send("Error registering user");
    }
});

module.exports = router;
