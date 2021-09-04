const mongoose = require('mongoose');
mongoose.pluralize(null);

const inventorySchema = new mongoose.Schema({
    ProductId: Number,
    ProductName: String,
    Brand: String,
    Color: String,
    BuyingPrice: Number,
    SellingPrice: Number,
    Quantity: Number,
    ReorderPoint: Number
});

const Inventory = mongoose.model('Inventory', inventorySchema)
module.exports = Inventory;