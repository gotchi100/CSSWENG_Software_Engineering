const express = require('express');
//const router = require('./routes/routes');
const dotenv = require('dotenv');

dotenv.config();
const _Port = process.env.PORT;

// express app
const app = express();

// make client-side scripts and files accessible
app.use(express.static('public'));

// takes url encoded data and parse it into an object usable from a req object
app.use(express.urlencoded({extended: true}));

// register view engine
app.set('view engine','ejs');

app.listen(_Port, () => {
    console.log('Server is running!');
  });

app.get('/', (req, res) => {
    res.render('sales-customer-po-form');
})
