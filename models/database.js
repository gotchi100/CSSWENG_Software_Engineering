const mongoose = require('mongoose');
const Inventory = require('./inventory.js');
const Sales = require('./sales.js');
const Supplier = require('./supplier.js');
const SupplierPO = require('./supplierPO.js');
const Account = require('./account.js');
const Shrinkage = require('./shrinkage.js');
const dotenv = require('dotenv');
dotenv.config();
const DB_URL = process.env.DB_URL;
// additional connection options
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

const database = {

    connect: function() {
        mongoose.connect(DB_URL, options, function(error) {
            if(error) throw error;
            console.log('Connected to database');
        })
    },

    // mongoose inventory model
    Inventory,

    // mongoose sales model
    Sales,

    // mongoose supplier model
    Supplier,

    // mongoose supplierPO model
    SupplierPO,

    // mongoose account model
    Account,

    // mongoose shrinkage model
    Shrinkage


}

module.exports = database;