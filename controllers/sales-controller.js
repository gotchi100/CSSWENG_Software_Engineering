const db = require('../models/database.js');


const inventoryController = {
	
	GetSalesPOFormView: (req, res) => {
		if(req.session.username)
		{
			db.Inventory.find()
			.then((ProductList) => {
				db.Sales.find()
				.then((SalesList) => {
					res.render('sales-customer-po-form', {ProductList: ProductList, SalesList: SalesList, title: "Customer PO Form"});
				});
			});
		}
		else
		{
            res.redirect('/');
		}  
    },
	
	PostSalesAddPO: async (req, res) => { 

        db.Sales.find()
		.then((SalesList) => {
			
            // generate new id based on the highest id on the database
            var next_id = 0;
            for(var i = 0; i < SalesList.length; i++) {
                if(SalesList[i].ProductId > next_id) {
                    next_id = SalesList[i].ProductId;
                }
            }
            next_id += 1;

			var tempDate = [];
			tempDate.push(req.body.DateOrdered);
			tempDate.push(req.body.PickupDate);

			var temp, day, month, year;
			var resultDate = [];

			for(var i = 0; i < tempDate.length; i++)
			{
				var temp = new Date(tempDate[i]);
				var day = temp.getDate();
				var month = temp.getMonth() + 1;
				var year = temp.getFullYear();
				if(month < 10)
				{
					month = "0" + month;
				}
				if(day < 10)
				{
					day = "0" + day;
				}
				resultDate.push(month + "/" + day + "/" + year)

			}
			
			if(req.body.Physical)
			{
				var stat = "completed";
			}
			else if(req.body.Online)
			{
				var stat = "packing";
			}

			// added this
			var productNames = [];
			if(Array.isArray(req.body.ProductNames))
			{
				console.log("productnames is an array")
				for(var i = 0; i < req.body.ProductNames.length; i++)
				{
					var temp = req.body.ProductNames[i].split(", ");
					productNames.push(temp[0]);
				}
			}
			else
			{
				var temp = req.body.ProductNames.split(", ");
				productNames.push(temp[0]);
				console.log("productnames is not an array")
			}

            // store the new po details
			const sales = new db.Sales({
				CustomerPO: req.body.CustomerPO,
				CustomerOrderID: req.body.CustomerOrderID,
				CustomerName: req.body.CustomerName,
				Physical: req.body.Physical,
				Online: req.body.Online,
				DateOrdered: resultDate[0],
				PickupDate: resultDate[1],
				ProductNames: productNames,
				ProductUnitPrices: req.body.ProductUnitPrices,
				ProductQuantities: req.body.ProductQuantities,
				ProductPrices: req.body.ProductPrices,
				TotalPrice: req.body.TotalPrice,
				Status: stat
			});

            // save the details to the database
            sales.save()
            console.log("Sale added to sales database:\n" + sales);
			
			for(var i = 0; i < sales.ProductNames.length; i++)
			{
				var productname = sales.ProductNames[i];
				quantity = sales.ProductQuantities[i];
				if (sales.Physical)
				{
					(function (productname, quantity) {
						db.Inventory.findOne({ProductName: productname}, function (err, result)
						{
							newquantity1 = result.ForecastQuantity - quantity;
							newquantity2 = result.Quantity - quantity;
							
							(function (productname, newquantity1, newquantity2) {
								db.Inventory.updateOne({ProductName: productname},
								{
									ForecastQuantity: newquantity1,
									Quantity: newquantity2
								}, function(err, result){});
							})(productname, newquantity1, newquantity2);
						});
					})(productname, quantity);
				}
				else if (sales.Online)
				{
					(function (productname, quantity) {
						db.Inventory.findOne({ProductName: productname}, function (err, result)
						{
							newquantity1 = result.ForecastQuantity - quantity;
							
							(function (productname, newquantity1) {
								db.Inventory.updateOne({ProductName: productname},
								{
									ForecastQuantity: newquantity1
								}, function(err, result){});
							})(productname, newquantity1);
						});
					})(productname, quantity);
				}
			}
			
			res.redirect('/sales-customer-order-list');
        });
    },
	
	GetIndividualProduct: async (req, res) => {

		var product = req.query.productInfo;
        db.Inventory.findOne({ProductName: product[0], Brand: product[1], Color: product[2]}, function (err, result)
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

	GetSalesListView: (req, res) => {
		if(req.session.username)
		{
			db.Sales.find()
			.then((SalesList) => {
	
				res.render('sales-customer-order-list', {SalesList, title: "Customer Order List"});
			});
		}
		else
		{
            res.redirect('/');
		}
    },
	
	GetIndividualSale: async (req, res) => {
		
		var po = req.query.po;
        db.Sales.findOne({CustomerPO: po}, function(err, result)
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
	
	PostUpdateStatus: async (req, res) => {
		
		var po = req.body.po
		var type = req.body.type
		if (type == "onroute") {
			db.Sales.findOneAndUpdate({CustomerPO: po}, {Status: "delivering"}, {new: true}, function(err, result){});
		}
		else if (type == "delivering") {
			db.Sales.findOne({CustomerPO: po}, function(err, result)
			{
				for(var i = 0; i < result.ProductNames.length; i++)
				{
					productname = result.ProductNames[i];
					quantity = result.ProductQuantities[i];
					(function (productname, quantity) {
						db.Inventory.findOne({ProductName: productname}, function (err, resulti)
						{
							newquantity1 = resulti.Quantity - quantity;
							
							(function (productname, newquantity1) {
								db.Inventory.updateOne({ProductName: productname},
								{
									Quantity: newquantity1
								}, function(err, result){});
							})(productname, newquantity1);
						});
					})(productname, quantity);
				}
			});
			
			db.Sales.findOneAndUpdate({CustomerPO: po}, {Status: "delivered"}, {new: true}, function(err, result){});
		}
		
		db.Sales.find()
		.then((SalesList) => {
			
			res.render('sales-customer-order-list', {SalesList, title: "Customer Order List"});
		});
    },
	
	PostDeleteOneSale: async (req, res) => {
    
        var po = req.body.tempSalesPO;
		var returned = req.body.returned;
		
		db.Sales.findOne({CustomerPO: po}, function(err, result)
		{
			if (result.Status == "packing" || result.Status == "delivering")
			{
				for(var i = 0; i < result.ProductNames.length; i++)
				{
					productname = result.ProductNames[i];
					quantity = result.ProductQuantities[i];
					(function (productname, quantity) {
						db.Inventory.findOne({ProductName: productname}, function (err, resulti)
						{
							newquantity1 = resulti.ForecastQuantity + quantity;
							
							(function (productname, newquantity1) {
								db.Inventory.updateOne({ProductName: productname},
								{
									ForecastQuantity: newquantity1
								}, function(err, result){});
							})(productname, newquantity1);
						});
					})(productname, quantity);
				}
			}
			else if ((result.Status == "delivered" || result.Status == "completed") && returned)
			{
				for(var i = 0; i < result.ProductNames.length; i++)
				{
					productname = result.ProductNames[i];
					quantity = result.ProductQuantities[i];
					(function (productname, quantity) {
						db.Inventory.findOne({ProductName: productname}, function (err, result)
						{
							newquantity1 = result.ForecastQuantity + quantity;
							newquantity2 = result.Quantity + quantity;
							
							(function (productname, newquantity1, newquantity2) {
								db.Inventory.updateOne({ProductName: productname},
								{
									ForecastQuantity: newquantity1,
									Quantity: newquantity2
								}, function(err, result){});
							})(productname, newquantity1, newquantity2);
						});
					})(productname, quantity);
				}
			}
			
			db.Sales.deleteOne({CustomerPO: po}, function(err, result){
				res.send(result);
			});
		});
    },

    PostDeleteManySales: async (req, res) => {

        var po = JSON.parse(req.body.SalesPO);
		var returned = req.body.returned;
		
		for(var i = 0; i < po.length; i++)
		{
			db.Sales.findOne({CustomerPO: po[i]}, function(err, result)
			{
				if (result.Status == "packing" || result.Status == "delivering")
				{
					for(var i = 0; i < result.ProductNames.length; i++)
					{
						productname = result.ProductNames[i];
						quantity = result.ProductQuantities[i];
						(function (productname, quantity) {
							db.Inventory.findOne({ProductName: productname}, function (err, resulti)
							{
								newquantity1 = resulti.ForecastQuantity + quantity;
								
								(function (productname, newquantity1) {
									db.Inventory.updateOne({ProductName: productname},
									{
										ForecastQuantity: newquantity1
									}, function(err, result){});
								})(productname, newquantity1);
							});
						})(productname, quantity);
					}
				}
				else if ((result.Status == "delivered" || result.Status == "completed") && returned)
				{
					for(var i = 0; i < result.ProductNames.length; i++)
					{
						productname = result.ProductNames[i];
						quantity = result.ProductQuantities[i];
						(function (productname, quantity) {
							db.Inventory.findOne({ProductName: productname}, function (err, result)
							{
								newquantity1 = result.ForecastQuantity + quantity;
								newquantity2 = result.Quantity + quantity;
								
								(function (productname, newquantity1, newquantity2) {
									db.Inventory.updateOne({ProductName: productname},
									{
										ForecastQuantity: newquantity1,
										Quantity: newquantity2
									}, function(err, result){});
								})(productname, newquantity1, newquantity2);
							});
						})(productname, quantity);
					}
				}
				
				db.Sales.deleteOne({CustomerPO: po}, function(err, result){
					
				});
			});
		}
		res.status(200).send();
    },
}


module.exports = inventoryController;