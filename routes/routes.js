const express = require('express');
const mongoose = require('mongoose');

const inventoryController = require('../controllers/inventory-controller');
const reorderController = require('../controllers/reorder-controller');
const salesController = require('../controllers/sales-controller');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', {title: "Login"});
});

router.get('/register', (req, res) => {
    res.render('register', {title: "Register"});
});

router.get('/', (req, res) => {
    res.redirect('dashboard')
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard', {title: "Dashboard"});
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
router.get('/is-product-available', inventoryController.IsProductAvailable);

router.post('/inventory-delete-one-product', inventoryController.DeleteOneProduct);

router.post('/inventory-delete-many-products', inventoryController.DeleteManyProduct);

// sales po form
router.get('/sales-customer-po-form', salesController.GetSalesPOFormView);

router.post('/sales-add-po-form', salesController.PostSalesAddPO);

// sales 
router.get('/sales-customer-order-list', salesController.GetSalesListView);

router.get('/sales-get-sale', salesController.GetIndividualSale);

router.get('/sales-update-status', salesController.GetUpdateStatus);

// reorder 
router.get('/reorder-supplier-po-form', reorderController.SupplierPO.GetSupplierPOForm);

router.get('/reorder-supplier-form', reorderController.Supplier.GetSupplierForm);

router.get('/get-supplier-info', reorderController.Supplier.FindSupplier);

router.post('/reorder-add-supplier', reorderController.Supplier.AddSupplier);

router.post('/reorder-add-supplier-po', reorderController.SupplierPO.AddSupplierPO);

router.get('/reorder-supplier-order-list', reorderController.SupplierPO.GetOrderList);

router.get('/reorder-get-one-supplier-po', reorderController.SupplierPO.FindSupplierPO);

router.post('/reorder-delete-one-po', reorderController.SupplierPO.DeleteOnePO);

router.post('/reorder-delete-many-po', reorderController.SupplierPO.DeleteManyProduct);

router.post('/reorder-update-status', reorderController.SupplierPO.UpdateOne);

router.get('/reports-total-sales-and-expenses', (req, res) => {
    res.render('reports-total-sales-and-expenses', {title: "Total Sales and Expenses Reports"});
});

router.get('/reports-shrinkages', (req, res) => {
    res.render('reports-shrinkages', {title: "Shrinkages Reports"});
});





module.exports = router;