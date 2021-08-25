const express = require('express');

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

router.get('/inventory-view', (req, res) => {
    res.render('inventory-view');
});

router.get('/inventory-pricelist', (req, res) => {
    res.render('inventory-pricelist');
});

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





module.exports = router;