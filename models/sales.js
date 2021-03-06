const mongoose = require('mongoose');
mongoose.pluralize(null);

const salesSchema = new mongoose.Schema({
    CustomerPO: Number,
    CustomerOrderID: Number,
    CustomerName: String,
	Physical: String,
	Online: String,
    DateOrdered: String,
    PickupDate: String,
    ProductNames: [String],
	ProductUnitPrices: [Number],
	ProductQuantities: [Number],
	ProductPrices: [Number],
	TotalPrice: Number,
	Status: String
});

const Sales = mongoose.model('Sales', salesSchema)
module.exports = Sales;