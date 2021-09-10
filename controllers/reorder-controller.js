const db = require('../models/database.js');

const reorderController = {

    Supplier: {

        GetSupplierForm: (req, res) => {
            if(req.session.username)
            {
                db.Supplier.find()
                    .then((SupplierList) => {
                        var next_id = 0;
                        for(var i = 0; i < SupplierList.length; i++) {
                            if(SupplierList[i].Id > next_id) {
                                next_id = SupplierList[i].Id;
                            }
                        }
                        next_id += 1;
    
                        res.render('reorder-add-supplier', {next_id, title: "Supplier Form"});
                    });
            }
            else
            {
                res.render('login', {title: "Login"});
            }     
        },

        AddSupplier: (req, res) => {

            var temp = req.body.SupplierInfo;
    
            // store the new supplier details
            const supplier = new db.Supplier({
                Id: temp.Id,
                Name: temp.Name,
                Number: temp.Number,
                Email: temp.Email,
                Address: temp.Address,
                Products: temp.Products
            });

            // save the details to the database
            supplier.save()
            console.log("Supplier added to supplier database:\n" + supplier);
            res.status(200).send(supplier);
        },

        FindSupplier: async (req, res) => {

            await db.Supplier.findOne({Name: req.query.Name})
                    .then((result) => {
                        res.status(200).send(result);
                    });
        }
    },

    SupplierPO: {
        GetSupplierPOForm: (req, res) => {
            if(req.session.username)
            {
                db.Supplier.find()
                    .then((SupplierList) => {
                        db.SupplierPO.find()
                            .then((SupplierPOList) => {
                                var next_PO = 0;
                                for(var i = 0; i < SupplierPOList.length; i++) {
                                    if(SupplierPOList[i].PO > next_PO) {
                                        next_PO = SupplierPOList[i].PO;
                                    }
                                }
                                next_PO += 1;
                                res.render('reorder-supplier-po-form', {SupplierList, next_PO, title: "Supplier PO Form"});
                            })
                    });
            }
            else
            {
                res.render('login', {title: "Login"});
            }   
        },
    
        AddSupplierPO: (req, res) => {
            
            var temp = req.body.SupplierPOInfo;

            const supplierPO = new db.SupplierPO({
                PO: temp.PO,
                SupplierID: temp.SupplierID,
                SupplierName: temp.SupplierName,
                ModeOfPayment: temp.ModeOfPayment,
                Products: temp.Products,
                TotalPrice: temp.TotalPrice,
                DateOrdered: temp.DateOrdered,
                Status: temp.Status
            });

            supplierPO.save();
            console.log("Supplier PO added to supplierPO database:\n" + supplierPO);
            res.status(200).send(supplierPO);
        },

        GetOrderList: (req, res) => {
            if(req.session.username)
            {
                db.SupplierPO.find()
                    .then((SupplierPOList) => {
                        res.render('reorder-supplier-order-list', {SupplierPOList, title: "Supplier Order List"});
                    });
            }
            else
            {
                res.render('login', {title: "Login"});
            }   
        },

        FindSupplierPO: async (req, res) => {

            await db.SupplierPO.findOne({PO: req.query.PONumber})
            .then((SupplierPOInfo) => {
                db.Supplier.findOne({Id: SupplierPOInfo.SupplierID})
                    .then((SupplierInfo) => {
                        var result = {
                            Supplier: SupplierInfo,
                            SupplierPO: SupplierPOInfo
                        }
                        res.status(200).send(result);

                    })
            });
        },

        DeleteOnePO: async (req, res) => {
            const deleted_count = await db.SupplierPO.deleteOne({PO: req.body.PONumber}).exec();
            console.log(deleted_count);
            res.status(200).send();
        },

        DeleteManyProduct: async (req, res) => {

            var PONumber = JSON.parse(req.body.PONumberArr)
            const deleted_count = await db.SupplierPO.deleteMany({PO: {$in: PONumber}}).exec();
            console.log(deleted_count);
            res.status(200).send();
        },

        UpdateOne: async (req, res) => {

            var temp = req.body.SupplierPOInfo;
    
            await db.SupplierPO.updateOne({PO: temp.PONumber}, 
                                        {Status: temp.Status}).exec()
            .then(() => {
                console.log("Product updated in the database");
                res.status(200).send(temp);
            })
        }
    }




}

module.exports = reorderController;