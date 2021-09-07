const db = require('../models/database.js');

const inventoryController = {

    View: {
        GetView: (req, res) => {

            db.Inventory.find()
            .then((ProductList) => {
    
                res.render('inventory-view', {ProductList});
            });
        },

        AddOneProduct: async (req, res) => { 
    
            await db.Inventory.find()
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
                const inventory = new db.Inventory({
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
    
        AddManyProduct: async (req, res) => { 
    
            await db.Inventory.find()
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
    
                db.Inventory.insertMany(req.body.ProductInfo).then((result) => {
                    res.status(200).send(result);
                    console.log("Product added to inventory database:\n" + result);
                })
            });
        },
    
        UpdateOneProduct: async(req, res) => {
    
            var temp = req.body.ProductInfo;
    
            await db.Inventory.updateOne({ProductId: temp[0].ProductId}, 
                                        {ProductName: temp[0].ProductName, 
                                            Brand: temp[0].Brand, 
                                            Color: temp[0].Color, 
                                            SellingPrice: temp[0].SellingPrice, 
                                            Quantity: temp[0].Quantity, 
                                            ReorderPoint: temp[0].ReorderPoint}).exec()
            .then(() => {
                console.log("Product updated in the database");
                res.status(200).send(temp);
            })
        },
    
        UpdateManyProduct: async(req, res) => {
    
            var temp = req.body.ProductInfo;
    
            var tempArr = [];
    
            for(var i = 0; i < temp.length; i++)
            {
                tempArr.push({
                    updateOne: {
                        "filter" : {ProductId: temp[i].ProductId},
                        "update" : {ProductName: temp[i].ProductName, 
                            Brand: temp[i].Brand, 
                            Color: temp[i].Color, 
                            SellingPrice: temp[i].SellingPrice, 
                            Quantity: temp[i].Quantity, 
                            ReorderPoint: temp[i].ReorderPoint}
                    }
                });
            }   
    
            db.Inventory.bulkWrite(tempArr).then((result) => {
                console.log("Products updated in the database");
                res.status(200).send(temp);
            })
        }
    },

    Pricelist: {
        GetPricelist: (req, res) => {
    
            db.Inventory.find()
            .then((ProductList) => {
    
                res.render('inventory-pricelist', {ProductList});
            });
        },

        UpdateOneProduct: async(req, res) => {
    
            var temp = req.body.ProductInfo;
    
            await db.Inventory.updateOne({ProductId: temp[0].ProductId}, 
                                        {ProductName: temp[0].ProductName, 
                                            Brand: temp[0].Brand, 
                                            Color: temp[0].Color, 
                                            SellingPrice: temp[0].SellingPrice, 
                                            BuyingPrice: temp[0].BuyingPrice}).exec()
            .then(() => {
                console.log("Product updated in the database");
                res.status(200).send(temp);
            })
        },
    
        UpdateManyProduct: async(req, res) => {
    
            var temp = req.body.ProductInfo;
    
            var tempArr = [];
    
            for(var i = 0; i < temp.length; i++)
            {
                tempArr.push({
                    updateOne: {
                        "filter" : {ProductId: temp[i].ProductId},
                        "update" : {ProductName: temp[i].ProductName, 
                            Brand: temp[i].Brand, 
                            Color: temp[i].Color, 
                            SellingPrice: temp[i].SellingPrice, 
                            BuyingPrice: temp[i].BuyingPrice}
                    }
                });
            }   
    
            db.Inventory.bulkWrite(tempArr).then((result) => {
                console.log("Products updated in the database");
                res.status(200).send(temp);
            })
        }

    },
    
    DeleteOneProduct: async (req, res) => {
    
        var ProductId = req.body.tempProductId;
        const deleted_count = await db.Inventory.deleteOne({ProductId: ProductId}).exec();
        console.log(deleted_count);
        res.status(200).send();
    },

    DeleteManyProduct: async (req, res) => {

        var ProductId = JSON.parse(req.body.ProductId)
        const deleted_count = await db.Inventory.deleteMany({ProductId: {$in: ProductId}}).exec();
        console.log(deleted_count);
        res.status(200).send();
    },

    IsProductAvailable: async (req, res) => {

        var ProductName = req.query.ProductName;
        var Color = req.query.Color;
        var temp = false;
        await db.Inventory.find()
        .then((result) => {
            for(var i = 0; i < result.length; i++){
                if(result[i].ProductName.toLowerCase().trim() == ProductName.toLowerCase().trim() && 
                    result[i].Color.toLowerCase().trim() == Color.toLowerCase().trim()) {
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
    }
}


module.exports = inventoryController;