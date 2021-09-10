const db = require('../models/database.js');

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

            // store the new po details
            const sales = new db.Sales({
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
			
			for(var i = 0; i < sales.ProductNames.length; i++) {
				
				firstquantity = 0;
				secondquantity = 0;
				newquantity = 0;
				productname = sales.ProductNames[i];
				firstquantity = sales.ProductQuantities[i];
				await db.Inventory.findOne({ProductName: productname}, function (err, result)
				{
					if(err)
					{
						console.log (err);
						res.send();
					}
					else
					{
						secondquantity = result.Quantity;
						newquantity = secondquantity - firstquantity;
						db.Inventory.findOneAndUpdate({ProductName: productname}, {Quantity: newquantity}, {new: true}, function(err, result)
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
					}
				});
			}
			
            // save the details to the database
            sales.save()
            console.log("Sale added to sales database:\n" + sales);
        });
		
		res.redirect('/sales-customer-order-list');
    },
	
	GetIndividualProduct: async (req, res) => {

		var productname = req.query.productname;
        db.Inventory.findOne({ProductName: productname}, function (err, result)
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
			db.Sales.findOneAndUpdate({CustomerPO: po}, {Status: "delivered"}, {new: true}, function(err, result){});
		}
		
		db.Sales.find()
		.then((SalesList) => {
			
			res.render('sales-customer-order-list', {SalesList, title: "Customer Order List"});
		});
    },
	
	PostDeleteOneSale: async (req, res) => {
    
        var SalesPO = req.body.tempSalesPO;
        db.Sales.deleteOne({CustomerPO: SalesPO}, function(err, result){
			res.send(result);
		});
    },

    PostDeleteManySales: async (req, res) => {

        var SalesPO = JSON.parse(req.body.SalesPO)
		db.Sales.deleteMany({CustomerPO: {$in: SalesPO}}, function(err, result){
			res.send(result);
		});
    },
}


module.exports = inventoryController;