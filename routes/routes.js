const express = require('express');
const mongoose = require('mongoose');

const Controller = require('../controllers/controller');
const inventoryController = require('../controllers/inventory-controller');
const reorderController = require('../controllers/reorder-controller');
const salesController = require('../controllers/sales-controller');
const reportController = require('../controllers/report-controller');
const accountController = require('../controllers/account-controller');

const router = express.Router();

router.get('/login', accountController.Login.GetLoginForm);

router.get('/check-login-information', accountController.Login.CheckInformation);

router.get('/register', accountController.Register.GetRegisterForm);

router.get('/check-register-email', accountController.Register.CheckEmail);

router.get('/check-register-username', accountController.Register.CheckUsername);

router.post('/submit-register', accountController.Register.SignUp);

router.get('/', Controller.GetIndex);

router.get('/dashboard', Controller.GetDashboard);

router.get('/settings', Controller.GetSettings);

router.get('/check-role', Controller.CheckRole);

router.get('/logout', Controller.Logout);

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

// inventory shrinkage
router.get('/inventory-shrinkage', inventoryController.Shrinkage.GetShrinkageForm)

router.post('/shrinkage-post-one-data', inventoryController.Shrinkage.ShrinkageAction)

router.post('/shrinkage-post-many-data', inventoryController.Shrinkage.ShrinkageManyAction)

router.post('/temp-delete-all-shrinkages', inventoryController.Shrinkage.tempDelete);

router.get('/get-product-for-shrinkage', inventoryController.Shrinkage.GetProduct)
// other inventory functions used by both view and pricelist
router.get('/is-product-available', inventoryController.IsProductAvailable);

router.post('/inventory-delete-one-product', inventoryController.DeleteOneProduct);

router.post('/inventory-delete-many-products', inventoryController.DeleteManyProduct);



// sales po form
router.get('/sales-customer-po-form', salesController.GetSalesPOFormView);

router.post('/sales-add-po-form', salesController.PostSalesAddPO);

// sales 
router.get('/sales-customer-order-list', salesController.GetSalesListView);

router.get('/sales-get-product', salesController.GetIndividualProduct);

router.get('/sales-get-sale', salesController.GetIndividualSale);

router.post('/sales-update-status', salesController.PostUpdateStatus);

router.post('/sales-delete-one-product', salesController.PostDeleteOneSale);

router.post('/sales-delete-many-products', salesController.PostDeleteManySales);

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

// report
router.get('/reports-total-sales-and-expenses', reportController.GetSalesAndExpensesView);

router.get('/get-sales-report', reportController.Sales.GetReport);

router.get('/get-expenses-report', reportController.Expenses.GetReport);

router.get('/reports-shrinkages', reportController.Shrinkages.GetView);

router.get('/get-shrinkages-report', reportController.Shrinkages.GetReport);





module.exports = router;