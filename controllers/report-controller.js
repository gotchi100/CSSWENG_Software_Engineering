const db = require('../models/database.js');

const reportController = {
    
    GetSalesAndExpensesView: (req, res) => {
        if(req.session.username)
            {
                res.render('reports-total-sales-and-expenses', {title: "Total Sales and Expenses Reports"});
            }
            else
            {
                res.render('login', {title: "Login"});
            }  
    },

    Sales: {
        
        GetReport: (req, res) => {
            db.Sales.find()
                .then((result) => {
                    res.status(200).send(result);
                })
        }
    },

    Expenses: {
        
        GetReport: (req, res) => {
            db.SupplierPO.find()
                .then((result) => {
                    res.status(200).send(result);
                })
        }
    },

    Shrinkages: {

        GetView: (req, res) => {
            if(req.session.username)
            {
                res.render('reports-shrinkages', {title: "Shrinkages Reports"});
            }
            else
            {
                res.render('login', {title: "Login"});
            }  
        },

        GetReport: (req, res) => {
            db.SupplierPO.find()
                .then((SupplierPOInfo) => {
                    db.Inventory.find()
                        .then((InventoryInfo) => {
                            result = {
                                SupplierPO: SupplierPOInfo,
                                Inventory: InventoryInfo
                            }
                            res.status(200).send(result);
                        });

                })
        }
    }

}

module.exports = reportController;