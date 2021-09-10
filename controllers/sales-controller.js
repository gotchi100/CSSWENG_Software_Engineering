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
		if(req.session.username)
		{
			Inventory.find()
			.then((ProductList) => {
				Sales.find()
				.then((SalesList) => {
					res.render('sales-customer-po-form', {ProductList: ProductList, SalesList: SalesList, title: "Customer PO Form"});
				});
			});
		}
		else
		{
			res.render('login', {title: "Login"});
		}  

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
				ProductUnitPrices: req.body.ProductUnitPrices,
                ProductQuantities: req.body.ProductQuantities,
				ProductPrices: req.body.ProductPrices,
				TotalPrice: req.body.TotalPrice,
                Status: "packing"
            });

            // save the details to the database
            sales.save()
            console.log("Sale added to sales database:\n" + sales);
        });
		
		Sales.find()
        .then((SalesList) => {

            res.render('sales-customer-order-list', {SalesList, title: "Customer Order List"});
        });
    },
	
	GetSalesListView: (req, res) => {
		if(req.session.username)
		{
			Sales.find()
			.then((SalesList) => {
	
				res.render('sales-customer-order-list', {SalesList, title: "Customer Order List"});
			});
		}
		else
		{
			res.render('login', {title: "Login"});
		}  
    },
	
	GetIndividualSale: (req, res) => {
		
		var po = req.query.po;
        Sales.findOne({CustomerPO: po}, function(err, result)
		{
			if(err)
			{
				console.log (err);
				res.send();
			}
			else
			{
				console.log (result);
				res.send(result);
			}
        });
    },
	
	PostUpdateStatus: (req, res) => {
		
		var po = req.body.po
		var type = req.body.type
		if (type == "onroute") {
			Sales.findOneAndUpdate({CustomerPO: po}, {Status: "delivering"}, {new: true}, function(err, result){});
		}
		else if (type == "delivering") {
			Sales.findOneAndUpdate({CustomerPO: po}, {Status: "delivered"}, {new: true}, function(err, result){});
		}
		
		Sales.find()
		.then((SalesList) => {
			
			res.render('sales-customer-order-list', {SalesList, title: "Customer Order List"});
		});
    },
	
	PostDeleteOneSale: (req, res) => {
    
        var SalesPO = req.body.tempSalesPO;
        Sales.deleteOne({CustomerPO: SalesPO}, function(err, result){
			res.send(result);
		});
    },

    PostDeleteManySales: (req, res) => {

        var SalesPO = JSON.parse(req.body.SalesPO)
		Sales.deleteMany({CustomerPO: {$in: SalesPO}}, function(err, result){
			res.send(result);
		});
    },
}


module.exports = inventoryController;