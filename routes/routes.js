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

router.get('/inventory-view', inventoryController.GetInventoryView);

router.get('/check-product-name', inventoryController.GetCheckProductName);

router.post('/inventory-add-product', inventoryController.PostInventoryViewAddProduct);

router.post('/inventory-edit-product', inventoryController.PostInventoryViewEditProduct);

router.post('/inventory-delete-one-product', inventoryController.PostInventoryViewDeleteOneProduct);

router.post('/inventory-delete-many-product', inventoryController.PostInventoryViewDeleteManyProduct);

router.get('/inventory-pricelist', inventoryController.GetInventoryPricelist);

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