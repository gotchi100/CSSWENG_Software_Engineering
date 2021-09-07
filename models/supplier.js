const mongoose = require('mongoose');
mongoose.pluralize(null);

const supplierSchema = new mongoose.Schema({
    Id: Number,
    Name: String,
    Number: String,
    Email: String,
    Address: String,
    Products: Array
});

const Supplier = mongoose.model('Supplier', supplierSchema);
module.exports = Supplier;