const Product = require('../models/productModel');
const path = require('path');
const multer = require('multer');
const db = require("../models/connection")

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/', // Destination where images will be stored
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB max file size
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image'); // 'image' is the name of the file input field

// Check File Type
function checkFileType(file, cb) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif|webp/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

exports.getProducts = (req, res) => {
    Product.getAllProducts((err, results) => {
        if (err) throw err;
        res.render('index', { products: results }); // Render the homepage with products
    });
};

exports.showAddProductForm = (req, res) => {
    if (req.session && req.session.userId) {
        // Check if the user is an admin
        const userId = req.session.userId;
        const sql = "SELECT role FROM users WHERE id = ?";
        db.query(sql, [userId], (error, results) => {
            if (error) {
                console.log("Error fetching user role:", error);
                res.status(500).send("Error retrieving user role");
                return;
            }
            
            const userRole = results[0].role;
            
            // Check if the user is an admin
            if (userRole === 'admin') {
                // Render the add product page for admins
                res.render('add_product', { msg: null });
            } else {
                // Redirect to a different page or show an error message
                res.status(403).send("You do not have permission to access this page");
            }
        });
    } else {
        // Redirect to the login page if the user is not authenticated
        res.redirect("/login");
    }
     
};

exports.addProduct = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('add_product', { msg: err });
        } else {
            if (req.file == undefined) {
                res.render('add_product', { msg: 'No file selected!' });
            } else {
                // Extract product details from the form submission
                const { name, description, price } = req.body;
                // The path where the image is stored
                const image_path = `/uploads/${req.file.filename}`;

                const newProduct = { name, description, price, image_path };

                // Insert the new product into the database
                Product.addProduct(newProduct, (err, result) => {
                    if (err) throw err;
                    res.redirect('/add'); // Redirect to the homepage after adding the product
                });
            }
        }
    });
};

exports.searchProducts = (req, res) => {
    const searchTerm = req.query.query;
    const sql = "SELECT * FROM products WHERE name LIKE ? OR description LIKE ?";
    db.query(sql, [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.render('index', {
            products: results
        });
    });
};

exports.getProductDetails = (req, res) => {
    const productId = req.params.id;
    const sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql, [productId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.render('product_details', { product: results[0] });
        } else {
            res.status(404).send('Product not found');
        }
    });
};
