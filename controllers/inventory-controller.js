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

    GetInventoryPricelist: (req, res) => {

        Inventory.find()
        .then((ProductList) => {

            res.render('inventory-pricelist', {ProductList});
        });
    },

    GetCheckProductName: async (req, res) => {
    
        var ProductName = req.query.ProductName;
        var temp = false;
        await Inventory.find()
        .then((result) => {
            for(var i = 0; i < result.length; i++){
                if(result[i].ProductName.toLowerCase() == ProductName.toLowerCase()) {
                    temp = true;
                }
            }
            if(temp) {
                res.send(result);
            }
            else {
                res.send(null)
            }
        })

    },

    PostInventoryViewAddOneProduct: async (req, res) => { 

        await Inventory.find()
        .then((ProductList) => {

            // generate new id based on the highest id on the database
            var next_id = 0;
            for(var i = 0; i < ProductList.length; i++) {
                if(ProductList[i].ProductId > next_id) {
                    next_id = ProductList[i].ProductId;
                }
            }
            next_id += 1;

            var temp = req.body.ProductInfo;

            // store the new product details
            const inventory = new Inventory({
                ProductId: next_id,
                ProductName: temp[0].ProductName,
                Brand: temp[0].Brand,
                Color: temp[0].Color,
                BuyingPrice: temp[0].BuyingPrice,
                SellingPrice: temp[0].SellingPrice,
                Quantity: temp[0].Quantity,
                ReorderPoint: temp[0].ReorderPoint
            });

            // save the details to the database
            inventory.save()
            console.log("Product added to inventory database:\n" + inventory);
            res.status(200).send(inventory);
        });
    },

    PostInventoryViewAddManyProduct: async (req, res) => { 

        await Inventory.find()
        .then((ProductList) => {

            // generate new id based on the highest id on the database
            var next_id = 0;
            for(var i = 0; i < ProductList.length; i++) {
                if(ProductList[i].ProductId > next_id) {
                    next_id = ProductList[i].ProductId;
                }
            }
            next_id += 1;

            for(var x = 0; x < req.body.ProductInfo.length; x++) {
                req.body.ProductInfo[x].ProductId = next_id;
                next_id++;
            }

            Inventory.insertMany(req.body.ProductInfo).then((result) => {
                res.status(200).send(result);
                console.log("Product added to inventory database:\n" + result);
            })
        });
    },

    PostInventoryViewEditProduct: async(req, res) => {

        var ProductId = req.body.ProductId;
        await Inventory.updateOne({ProductId: ProductId}, {ProductName: req.body.ProductName, Brand: req.body.Brand, SellingPrice: req.body.SellingPrice, Quantity: req.body.Quantity, ReorderPoint: req.body.ReorderPoint}).exec()
        .then(() => {

            console.log("Product updated in the database");
            res.status(200).send();
        })
    },

    PostInventoryViewDeleteOneProduct: async (req, res) => {

        var ProductId = req.body.tempProductId;
        const deleted_count = await Inventory.deleteOne({ProductId: ProductId}).exec();
        console.log(deleted_count);
        res.status(200).send();
    },

    PostInventoryViewDeleteManyProduct: async (req, res) => {

        var ProductId = JSON.parse(req.body.ProductId)
        const deleted_count = await Inventory.deleteMany({ProductId: {$in: ProductId}}).exec();
        console.log(deleted_count);
        res.status(200).send();
    }

    

}


module.exports = inventoryController;