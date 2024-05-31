const db = require('./connection');

const Product = {
    getAllProducts: (callback) => {
        let sql = 'SELECT * FROM products';
        db.query(sql, callback);
    },
    addProduct: (product, callback) => {
        let sql = 'INSERT INTO products (name, description, price, image_path) VALUES (?, ?, ?, ?)';
        db.query(sql, [product.name, product.description, product.price, product.image_path], callback);
    }
};

module.exports = Product;