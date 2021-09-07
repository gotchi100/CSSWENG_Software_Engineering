const mongoose = require('mongoose');
mongoose.pluralize(null);

const supplierPOSchema = new mongoose.Schema({
    PO: Number,
    Supplier: {
        Name: String,
        Number: String,
        Email: String,
        Address: String
    },
    ModeOfPayment: String,
    Products: [{
        ProductName: String,
        UnitPrice: Number,
        Quantity: Number,
        Amount: Number
    }],
    DateOrdered: String,
    Status: String
});

const SupplierPO = mongoose.model('SupplierPO', supplierPOSchema);
module.exports = SupplierPO;