const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../models/connection");

const router = express.Router();

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (error, results) => {
        if (error) {
            console.log("Error fetching user:", error);
            res.status(500).send("Error logging in");
            return;
        }
        
        if (results.length === 0) {
            res.status(401).send("Invalid email or password");
            return;
        }
        
        const user = results[0];
        
        try {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.userId = user.id;
                req.session.isAdmin = user.role === 'admin';
                
                // Check if the user is an admin
                if (req.session.isAdmin) {
                    // Redirect to the add product page for admins
                    res.redirect("/add");
                } else {
                    // Redirect to the homepage for regular users
                    res.redirect("/");
                }
            } else {
                res.status(401).send("Invalid email or password");
            }
        } catch (error) {
            console.log("Error comparing passwords:", error);
            res.status(500).send("Error logging in");
        }
    });
});

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error logging out:", err);
            res.status(500).send("Error logging out");
            return;
        }
        res.redirect("/login");
    });
});

module.exports = router;
