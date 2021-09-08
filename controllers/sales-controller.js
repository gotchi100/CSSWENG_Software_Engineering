const express = require('express');
const mongoose = require('mongoose');
const Sales = require('../models/sales');
const Inventory = require('../models/inventory');

//connect to mongodb
const dbURI = 'mongodb+srv://cssweng_s13_group_2:cssweng_s13_group_2@wardrobechoicesmnl.fbjkw.mongodb.net/Database?retryWrites=true&w=majority'

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));


const inventoryController = {
	
	GetSalesPOFormView: (req, res) => {

		Inventory.find()
        .then((ProductList) => {

            res.render('sales-customer-po-form', {ProductList});
        });

    },
	
	PostSalesAddPO: (req, res) => { 

        Sales.find()
        .then((SalesList) => {

            // generate new id based on the highest id on the database
            var next_id = 0;
            for(var i = 0; i < SalesList.length; i++) {
                if(SalesList[i].ProductId > next_id) {
                    next_id = SalesList[i].ProductId;
                }
            }
            next_id += 1;

            // store the new po details
            const sales = new Sales({
				CustomerPO: req.body.CustomerPO,
                CustomerOrderID: req.body.CustomerOrderID,
                CustomerName: req.body.CustomerName,
				Physical: req.body.Physical,
				Online: req.body.Online,
                DateOrdered: req.body.DateOrdered,
                PickupDate: req.body.PickupDate,
                ProductNames: req.body.ProductNames,
                ProductQuantities: req.body.ProductQuantities,
                Status: "pending"
            });

            // save the details to the database
            sales.save()
            console.log("Sale added to sales database:\n" + sales);
			res.redirect('/sales-customer-order-list');
        });
    },
	
	GetSalesListView: (req, res) => {

        Sales.find()
        .then((SalesList) => {

            res.render('sales-customer-order-list', {SalesList});
        });

    },
	
	GetSalesTrackView: (req, res) => {

        Sales.find()
        .then((SalesList) => {

            res.render('sales-customer-order-tracker', {SalesList});
        });

    },
}


module.exports = inventoryController;