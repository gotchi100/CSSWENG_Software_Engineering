const mongoose = require('mongoose');
mongoose.pluralize(null);

const shrinkageSchema = new mongoose.Schema({
    Date: String,
    ProductName: String,
    Brand: String,
    Color: String,
    OriginalQuantity: Number,
    AdjustedQuantity: Number,
    Difference: Number,
    Price:Number,
    Cost: Number
});

const Shrinkage = mongoose.model('Shrinkage', shrinkageSchema)
module.exports = Shrinkage;