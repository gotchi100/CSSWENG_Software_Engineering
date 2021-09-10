const mongoose = require('mongoose');
const Inventory = require('./inventory.js');
const Sales = require('./sales.js');
const Supplier = require('./supplier.js');
const SupplierPO = require('./supplierPO.js');
const Account = require('./account.js');

// url to connect to mongodb
const dbURI = 'mongodb+srv://cssweng_s13_group_2:cssweng_s13_group_2@wardrobechoicesmnl.fbjkw.mongodb.net/Database?retryWrites=true&w=majority'

// additional connection options
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

const database = {

    connect: function() {
        mongoose.connect(dbURI, options, function(error) {
            if(error) throw error;
            console.log('Connected to database');
        })
    },

    // mongoose inventory model
    Inventory,

    Sales,
    // mongoose supplier model
    Supplier,

    // mongoose supplierPO model
    SupplierPO,

    // mongoose account model
    Account,


}

module.exports = database;