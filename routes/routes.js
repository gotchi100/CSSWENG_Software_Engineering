const express = require('express');
const mongoose = require('mongoose');

const inventoryController = require('../controllers/inventory-controller');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/', (req, res) => {
    res.render('dashboard');
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

// inventory view
router.get('/inventory-view', inventoryController.View.GetView);

router.post('/inventory-add-one-product', inventoryController.View.AddOneProduct);

router.post('/inventory-add-many-products', inventoryController.View.AddManyProduct);

router.post('/inventory-view-edit-one-product', inventoryController.View.UpdateOneProduct);

router.post('/inventory-view-edit-many-product', inventoryController.View.UpdateManyProduct);

// inventory pricelist
router.get('/inventory-pricelist', inventoryController.Pricelist.GetPricelist);

router.post('/inventory-pricelist-edit-one-product', inventoryController.Pricelist.UpdateOneProduct);

router.post('/inventory-pricelist-edit-many-product', inventoryController.Pricelist.UpdateManyProduct);

// other inventory functions used by both view and pricelist
router.get('/is-product-available', inventoryController.GetIsProductAvailable);

router.post('/inventory-delete-one-product', inventoryController.DeleteOneProduct);

router.post('/inventory-delete-many-products', inventoryController.DeleteManyProduct);

router.get('/sales-customer-po-form', (req, res) => {
    res.render('sales-customer-po-form');
});

router.get('/sales-customer-order-list', (req, res) => {
    res.render('sales-customer-order-list');
});

router.get('/sales-customer-order-tracker', (req, res) => {
    res.render('sales-customer-order-tracker');
});

router.get('/reorder-supplier-po-form', (req, res) => {
    res.render('reorder-supplier-po-form');
});

router.get('/reorder-add-supplier', (req, res) => {
    res.render('reorder-supplier-order-tracker');
});

router.get('/reorder-supplier-order-list', (req, res) => {
    res.render('reorder-supplier-order-list');
});

router.get('/reorder-supplier-order-tracker', (req, res) => {
    res.render('reorder-supplier-order-tracker');
});

router.get('/reports-total-sales-and-expenses', (req, res) => {
    res.render('reports-total-sales-and-expenses');
});

router.get('/reports-shrinkages', (req, res) => {
    res.render('reports-shrinkages');
});





module.exports = router;