const express = require('express');
const router = require('./routes/routes');
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

app.use(router);

// 404 page
app.use((req, res) => {
    console.log("404 on URL: " + req.url);
    res.status(404).render('404');
  });