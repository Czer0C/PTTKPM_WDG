//import express ,{ Router } from "express";
//import { urlencoded, json } from "body-parser";
const express = require('express');
const { Router } = express;
const bodyParser = require('body-parser');
const { urlencoded, json } = bodyParser;

const Product = require('../models/Product');
//import Product from '../models/Product';

const router = Router();
const app = express();
const checkAuth = require('../middleware/check-auth');

app.use(urlencoded({'extended': 'false'}));
app.use(json());


router.get('/getProductDetail/:type/:id', checkAuth, (req, res, next) => {    
    const { id, type } = req.params;
    //console.log(req.params);
    Product.aggregate([
        {
            $match: {
                productType: type,
                productID: id,
                
            }
        },
        {
            $lookup: {
                from: 'auction_session',
                localField: '_id',
                foreignField: 'productID',
                as: 'p'
            }
        },
        {
            $project: {                    
                productID: 1,
                productName: 1,
                productType: 1,
                productImage: 1,
                description: 1,
                "p.sessionID": 1,
                "p.bidTime": 1,
                "p.currentPrice": 1,
                "p.status": 1
            }
        }
    ], (err, result) => {
        if (err) {
            return next(err);
        }
        return res.json(result);
    });
});

// router.get('/getAllFigures', (req, res, next) => {
//     Product.find({
//         productType: 'Figures'
//     }, (err, products) => {
//         if (err) return next(err);

//         return res.json(products);
//     });
// });

// router.get('/getAllElectronics', (req, res, next) => {
//     Product.find({
//         productType: 'Electronics'
//     }, (err, products) => {
//         if (err) return next(err);
//         return res.json(products);
//     });
// });

// router.get('/getAllComputers', (req, res, next) => {
//     Product.find({
//         productType: 'Computers'
//     }, (err, products) => {
//         if (err) return next(err);

//         return res.json(products);
//     });
// });

// router.get('/getAllAppliances', (req, res, next) => {
//     Product.find({
//         productType: 'Appliances'
//     }, (err, products) => {
//         if (err) return next(err);

//         return res.json(products);
//     });
// });

// router.get('/getAllLuggageAndTravelGear', (req, res, next) => {
//     Product.find({
//         productType: 'Luggage & Travel Gear'
//     }, (err, products) => {
//         if (err) return next(err);

//         return res.json(products);
//     });
// });

// router.get('/getAllSportsAndOutdoors', (req, res, next) => {
//     Product.find({
//         productType: 'Sports & Outdoors'
//     }, (err, products) => {
//         if (err) return next(err);

//         return res.json(products);
//     });
// });

// router.get('/search/:keyword', (req, res, next) => {
//     console.log(req.params);
//     var query = 
//     [
//         {
//             "productName": {
//                 $regex: `.*${req.params.keyword}.`,
//                 $options: "i"
//             }
//         },
//         {
//             "description": {
//                 $regex: `.*${req.params.keyword}.`,
//                 $options: "i"
//             }
//         }
//     ]
//     Product.find({"$or": query}, (err, p) => {
//         console.log(p.length);
//         if (err) console.log(err);
//         else return res.json({
//             count: p == [] ? "0" : p.length,
//             data: p
//         });
//     })
// })

module.exports = router;