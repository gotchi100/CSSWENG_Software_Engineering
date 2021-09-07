const db = require('../models/database.js');

const reorderController = {

    Supplier: {

        GetSupplierForm: (req, res) => {
            res.render('reorder-add-supplier');
        },
        AddSupplier: async (req, res) => {

            await db.Supplier.find()
            .then((SupplierList) => {
    
                // generate new id based on the highest id on the database
                var next_id = 0;
                for(var i = 0; i < SupplierList.length; i++) {
                    if(SupplierList[i].Id > next_id) {
                        next_id = SupplierList[i].Id;
                    }
                }
                next_id += 1;

                var temp = req.body.SupplierInfo;
    
                // store the new supplier details

                const supplier = new db.Supplier({
                    Id: next_id,
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
            });
        },

        FindSupplier: async (req, res) => {

            await db.Supplier.findOne({Name: req.query.Name})
                    .then((result) => {
                        res.status(200).send(result);
                    });
        }
    },

    SupplierPO: {
        GetSupplierPOForm : (req, res) => {

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
                            res.render('reorder-supplier-po-form', {SupplierList, next_PO});
                        })
                });
        },
    
        AddSupplierPO: (req, res) => {
            
            var temp = req.body.SupplierPOInfo;

            const supplierPO = new db.SupplierPO({
                PO: temp.PO,
                Supplier: {
                    Name: temp.Supplier.Name ,
                    Number: temp.Supplier.Number,
                    Email: temp.Supplier.Email,
                    Address: temp.Supplier.Address
                },
                ModeOfPayment: temp.ModeOfPayment,
                Products: temp.Products,
                DateOrdered: temp.DateOrdered,
                Status: temp.Status
            });

            supplierPO.save();
            console.log("Supplier PO added to supplierPO database:\n" + supplierPO);
            res.status(200).send(supplierPO);
        }
    }




}

module.exports = reorderController;