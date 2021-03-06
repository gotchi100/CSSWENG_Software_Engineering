const db = require('../models/database.js');

const reportController = {
    
    GetSalesAndExpensesView: (req, res) => {
        if(req.session.username)
        {
            res.render('reports-total-sales-and-expenses', {title: "Total Sales and Expenses Reports"});
        }
        else
        {
            res.redirect('/');
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
                res.redirect('/');
            }  
        },

        GetReport: (req, res) => {
            db.Shrinkage.find()
                .then((result) => {
                    res.status(200).send(result);
                })
        }
    }

}

module.exports = reportController;