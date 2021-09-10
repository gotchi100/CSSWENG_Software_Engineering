const mongoose = require('mongoose');
mongoose.pluralize(null);

const accountSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Username: String,
    Email: String,
    Role: String,
    Password: String
});

const Account = mongoose.model('Account', accountSchema)
module.exports = Account;