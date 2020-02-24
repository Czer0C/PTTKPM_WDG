const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mongoose = require('mongoose');

const app = express();

mongoose.Promise = global.Promise;

const account = require('./routes/account');
const productRoute = require('./routes/productRoute');
const auctionRoute = require('./routes/auctionRoute');
const bidRoute = require('./routes/bidRoute');
const admin = require('./routes/admin');


// Check database connection 'mongodb://admin:god123456@ds119090.mlab.com:19090/chidori'
mongoose.connect('mongodb://admin:god123456@ds119090.mlab.com:19090/chidori')
    .then(() => {
        console.log("Database connection successful!");
    })
    .catch((err) => {
        console.log(err);
    });


app.use(bodyParser.urlencoded({'extended': 'false'}));
app.use(bodyParser.json());


// Add Access Control in every header
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
});

// Routes which should handle request
app.use('/account', account);
app.use('/product', productRoute);
app.use('/auction', auctionRoute);
app.use('/bid', bidRoute);
app.use('/admin', admin);

app.use((req, res, next) => {
    const error = new Error("Not found.");
    error.status = 404;
    next(error);
});
  
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


// to run, in terminal, type: npm start
app.listen(process.env.PORT || 3001, () => {console.log("Magic happened at port 3001");});