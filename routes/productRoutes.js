const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/add', productController.showAddProductForm);
router.post('/add', productController.addProduct);

// Search route
router.get('/search', productController.searchProducts);

// Product details route
router.get('/product/:id', productController.getProductDetails);

// Delete product route (only for admin)
router.post('/product/delete/:id', productController.deleteProduct);

module.exports = router;
