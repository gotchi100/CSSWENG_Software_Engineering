const express = require('express');
const mongoose = require('mongoose');
const Inventory = require('../models/inventory');

//connect to mongodb
const dbURI = 'mongodb+srv://cssweng_s13_group_2:cssweng_s13_group_2@wardrobechoicesmnl.fbjkw.mongodb.net/Database?retryWrites=true&w=majority'

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));


const inventoryController = {

    
    GetInventoryView: (req, res) => {

        Inventory.find()
        .then((ProductList) => {

            res.render('inventory-view', {ProductList});
        });

    },

    PostInventoryAddProduct: (req, res) => { 

        Inventory.find()
        .then((ProductList) => {

            // generate new id based on the highest id on the database
            var next_id = 0;
            for(var i = 0; i < ProductList.length; i++) {
                if(ProductList[i].ProductId > next_id) {
                    next_id = ProductList[i].ProductId;
                }
            }
            next_id += 1;

            // store the new product details
            const inventory = new Inventory({
                ProductId: next_id,
                ProductName: req.body.ProductName,
                Brand: req.body.Brand,
                BuyingPrice: req.body.BuyingPrice,
                SellingPrice: req.body.SellingPrice,
                Quantity: req.body.Quantity,
                ReorderPoint: req.body.ReorderPoint
            });

            // save the details to the database
            inventory.save()
            console.log("Product added to inventory database:\n" + inventory);
            res.status(200).send();
        });
    },

    PostInventoryDeleteOneProduct: (req, res) => {

        
        Inventory.deleteOne({ProductId: req.body.ProductId}).exec()
        .then(() => {
            res.status(200).send;
        })
    },

    PostInventoryDeleteManyProduct: (req, res) => {

        var x = JSON.parse(req.body.ProductId)
        Inventory.deleteMany({ProductId: {$in: x}}).exec()
        .then(() => {
            res.status(200).send;
        })
    }
}


module.exports = inventoryController;