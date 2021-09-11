const db = require('../models/database.js');
const { findOne } = require('../models/inventory.js');

const inventoryController = {

    View: {
        GetView: (req, res) => {

            if(req.session.username)
            {         
                db.Inventory.find()
                .then((ProductList) => {
                    res.render('inventory-view', {ProductList, title: "Inventory View"});
                    
                });
            }
            else
            {
                res.render('login', {title: "Login"});
            }  
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
                    OriginalQuantity: temp[0].Quantity,
                    ForecastQuantity: temp[0].Quantity,
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
            var equal = false;

            if(temp[0].OldOriginalQuantity == temp[0].OriginalQuantity)
            {
                equal = true;
            }

            if(equal)
            {
                await db.Inventory.updateOne({ProductId: temp[0].ProductId}, 
                                            {ProductName: temp[0].ProductName, 
                                                Brand: temp[0].Brand, 
                                                Color: temp[0].Color, 
                                                SellingPrice: temp[0].SellingPrice, 
                                                ReorderPoint: temp[0].ReorderPoint}).exec()
                    .then(() => {
                    console.log("Product updated in the database");
                    res.status(200).send(temp);
                    });
            }
            else
            {
                temp[0].ForecastQuantity = parseFloat(temp[0].ForecastQuantity) + parseFloat(temp[0].OriginalQuantity) - parseFloat(temp[0].OldOriginalQuantity);
                temp[0].Quantity = parseFloat(temp[0].Quantity) + parseFloat(temp[0].OriginalQuantity) - parseFloat(temp[0].OldOriginalQuantity);

                await db.Inventory.updateOne({ProductId: temp[0].ProductId}, 
                                        {ProductName: temp[0].ProductName, 
                                            Brand: temp[0].Brand, 
                                            Color: temp[0].Color, 
                                            SellingPrice: temp[0].SellingPrice, 
                                            OriginalQuantity: temp[0].OriginalQuantity,
                                            ForecastQuantity: temp[0].ForecastQuantity,
                                            Quantity: temp[0].Quantity,
                                            ReorderPoint: temp[0].ReorderPoint}).exec()
                    .then(() => {
                    console.log("Product updated in the database");
                    res.status(200).send(temp);
                    }); 
            }
            
        },
    
        UpdateManyProduct: async(req, res) => {
    
            var temp = req.body.ProductInfo;
            var tempArr = [];
            var equal = false;

            
    
            for(var i = 0; i < temp.length; i++)
            {
                if(temp[i].OldOriginalQuantity == temp[i].OriginalQuantity)
                {
                    equal = true;
                }

                if(equal)
                {
                    tempArr.push({
                        updateOne: {
                            "filter" : {ProductId: temp[i].ProductId},
                            "update" : {ProductName: temp[i].ProductName, 
                                Brand: temp[i].Brand, 
                                Color: temp[i].Color, 
                                SellingPrice: temp[i].SellingPrice,
                                ReorderPoint: temp[i].ReorderPoint}  
                        }
                    });
                }
                else
                {
                    temp[i].ForecastQuantity = parseFloat(temp[i].ForecastQuantity) + parseFloat(temp[i].OriginalQuantity) - parseFloat(temp[i].OldOriginalQuantity);
                    temp[i].Quantity = parseFloat(temp[i].Quantity) + parseFloat(temp[i].OriginalQuantity) - parseFloat(temp[i].OldOriginalQuantity);
                    tempArr.push({
                        updateOne: {
                            "filter" : {ProductId: temp[i].ProductId},
                            "update" : {ProductName: temp[i].ProductName, 
                                Brand: temp[i].Brand, 
                                Color: temp[i].Color, 
                                SellingPrice: temp[i].SellingPrice, 
                                OriginalQuantity: temp[i].OriginalQuantity, 
                                ForecastQuantity: temp[i].ForecastQuantity, 
                                Quantity: temp[i].Quantity, 
                                ReorderPoint: temp[i].ReorderPoint}  
                        }
                    });
                }
                
            }   
            db.Inventory.bulkWrite(tempArr).then((result) => {
                console.log("Products updated in the database");
                res.status(200).send(temp);
            })
        
        }
    },

    Pricelist: {
        GetPricelist: (req, res) => {
            if(req.session.username)
            {
                db.Inventory.find()
                .then((ProductList) => {
        
                    res.render('inventory-pricelist', {ProductList, title: "Inventory Pricelist"});
                });
            }
            else
            {
                res.render('login', {title: "Login"});
            }     
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

    Shrinkage: {
        GetShrinkageForm: (req, res) => {
            if(req.session.username)
            {         
                db.Inventory.find()
                .then((ProductList) => {
                    res.render('inventory-shrinkage', {ProductList, title: "Inventory View"});
                });
            }
            else
            {
                res.render('login', {title: "Login"});
            } 
        },

        GetProduct: (req, res) => {
            db.Inventory.findOne({ProductName: req.query.Product[0], Brand: req.query.Product[1], Color: req.query.Product[2]})
                .then((result) => {
                    res.status(200).send(result);
                });
        },

        ShrinkageAction: (req, res) => {
            var temp = req.body.ShrinkageInfo;

            db.Inventory.findOne({ProductName: temp[0].ProductName, Brand: temp[0].Brand, Color: temp[0].Color})
                .then((result) => {
                    var Difference = temp[0].OriginalQuantity - result.ForecastQuantity;
                    var OnHandQTY = temp[0].AdjustedQuantity;
                    var Forecast =  temp[0].AdjustedQuantity - Difference;

                    db.Inventory.updateOne({ProductName: temp[0].ProductName, Brand: temp[0].Brand, Color: temp[0].Color}, 
                            {Quantity: OnHandQTY, ForecastQuantity: Forecast})
                            .then(() => {

                                var Cost = Difference * result.BuyingPrice;

                                var shrinkage = new db.Shrinkage({
                                    Date: temp[0].Date,
                                    ProductName: temp[0].ProductName,
                                    Brand: temp[0].Brand,
                                    Color: temp[0].Color,
                                    OriginalQuantity: temp[0].OriginalQuantity,
                                    AdjustedQuantity: OnHandQTY,
                                    Difference: Difference,
                                    Price:result.BuyingPrice,
                                    Cost: Cost
                                })
                                shrinkage.save();
                                res.status(200).send();
                            })
                })
        },

        ShrinkageManyAction: async (req, res) => {
            var temp = req.body.ShrinkageInfo;

            for(var i = 0; i < temp.length; i++)
            {
                await db.Inventory.findOne({ProductName: temp[i].ProductName, Brand: temp[i].Brand, Color: temp[i].Color})
                    .then(async (result) => {
                        var Difference = temp[i].OriginalQuantity - result.ForecastQuantity;
                        var OnHandQTY = temp[i].AdjustedQuantity;
                        var Forecast =  temp[i].AdjustedQuantity - Difference;

                        await db.Inventory.updateOne({ProductName: temp[i].ProductName, Brand: temp[i].Brand, Color: temp[i].Color}, 
                                {Quantity: OnHandQTY, ForecastQuantity: Forecast})
                                .then(() => {
        
                                    var Cost = Difference * result.BuyingPrice;
                                    var shrinkage = new db.Shrinkage({
                                        Date: temp[i].Date,
                                        ProductName: temp[i].ProductName,
                                        Brand: temp[i].Brand,
                                        Color: temp[i].Color,
                                        OriginalQuantity: temp[i].OriginalQuantity,
                                        AdjustedQuantity: OnHandQTY,
                                        Difference: Difference,
                                        Price:result.BuyingPrice,
                                        Cost: Cost
                                    })
                                    shrinkage.save();
                                })
                    })
            }
            
            res.status(200).send();  
        },

        tempDelete: (req, res) => {db.Shrinkage.deleteMany().then(()=> {res.status(200).send();})}  //temporary delete all
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