require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser');
const indexRoute = require('./routes/index');
const regRoute = require('./routes/register');
const logRoute = require('./routes/login');
const productRoutes = require('./routes/productRoutes');
const ensureAuthenticated = require('./middleware/middleWare');
const session = require('express-session');
const expressLayouts = require("express-ejs-layouts");
const checkoutRoutes = require("./routes/checkout");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Middleware to set user information for views
app.use((req, res, next) => {
    res.locals.user = req.session.userId ? { id: req.session.userId, isAdmin: req.session.isAdmin } : null;
    next();
});

// Middleware to prevent caching of authenticated pages
app.use((req, res, next) => {
    if (req.session && req.session.userId) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    next();
});

app.use(expressLayouts);

// Apply routes that do not require authentication
app.use('/', regRoute);
app.use('/', logRoute);
app.use('/', productRoutes);
app.use("/", ensureAuthenticated, checkoutRoutes);

// Apply ensureAuthenticated middleware only to routes that require authentication
app.use('/', ensureAuthenticated, indexRoute);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
