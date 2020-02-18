//import express ,{ Router } from "express";
//import { urlencoded, json } from "body-parser";
const express = require('express');
const { Router } = express;
const bodyParser = require('body-parser');
const { urlencoded, json } = bodyParser;

// Import Models
const Account = require('../models/Account');
const UserSession = require('../models/UserSession');
const AuctionTicket = require('../models/AuctionTicket');

// import Account from "../models/Account";
// import UserSession from "../models/UserSession";
// import AuctionTicket from "../models/AuctionTicket";
// import AuctionSession from "../models/AuctionSession";
// import AuctionTicketStatus from "../models/AuctionTicketStatus";

// Setup Enviroment Variable
const dotenv = require('dotenv');
dotenv.config();

const router = Router();
const app = express();
const bcrypt = require('bcrypt');

// use this for Authenticate
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

// ObjectId type in mongoose
const ObjectId = require('mongoose').Types.ObjectId;

app.use(urlencoded({'extended': 'false'}));
app.use(json());

/* VERIFY */
router.get('/verify', (req, res, next) => {
    const { query } = req;
    const { token } = query;
    // Now the query should be something like this
    //?token=<user's token>

    UserSession.find({
        _id: token,
        isDeleted: false
    }, (err, session) => {
        if (err) {
            return next(err);
        }
        
        if (session.length != 1) {
            return res.json({
                success: false,
                message: 'Lỗi: Không hợp lệ'
            }).end();
        } 
        
        return res.json({
            success: true,
            message: 'OK'
        }).end();        
    });
});

/* SIGNIN */
router.post('/signin', (req, res, next) => {
    const { body } = req;
    const {
        username,
        password
    } = body;

    if (!username) {
        return res.json({
            success: false,
            message: 'Lỗi: Tên đăng nhập không được để trống'
        }).end();
    }
    if (!password) {
        return res.json({
            success: false,
            message: 'Lỗi: Mật khẩu không được để trống'
        }).end();
    }

    Account.find({
        username: username
    }, (err, users) => {
        if (err) {
            return next(err);
        }
        if (users.length != 1) {
            return res.json({
                success: false,
                message: 'Lỗi: Người dùng không tồn tại'
            }).end();
        }
        const user = users[0];
        if (!user.validPassword(password)) {
            return res.json({
                success: false,
                message: 'Lỗi: Mật khẩu không chính xác'
            }).end();
        }

        // Dòng sau đây sẽ chạy nếu user và pass hợp lệ
        const userSession = new UserSession();
        userSession.userID = user._id;
        userSession.save((err, data) => {
            if (err) {
                return next(err);
            }
            const accessToken = jwt.sign(
                {
                    user: username
                },
                process.env.JWT_KEY                
            );
            return res.json({
                success: true,
                message: 'Đăng nhập thành công',
                token: data._id,
                access_token: accessToken,
                accountType: user.accountType._id

            });
        });
    });
});

/* SAVE ACCOUNT A.K.A SIGNUP */
router.post('/signup', (req, res, next) => {
    const { body } = req;
    const {
        username,
        password,
        fullname,
        email,
        phone,
        address
    } = body; 

    if (!username) {
        return res.json({
            success: false,
            message: 'Lỗi: Tên đăng nhập không được để trống'
        }).end();
    }
    if (!password) {
        return res.json({
            success: false,
            message: 'Lỗi: Mật khẩu không được để trống'
        }).end();
    }
    if (!fullname) {
        return res.json({
            success: false,
            message: 'Lỗi: Họ tên không được để trống'
        }).end();
    }
    if (!email) {
        return res.json({
            success: false,
            message: 'Lỗi: Email không được để trống'
        }).end();
    }
    if (!phone) {
        return res.json({
            success: false,
            message: 'Lỗi: Số điện thoại không được để trống'
        }).end();
    }
    if (!address) {
        return res.json({
            success: false,
            message: 'Lỗi: Địa chỉ không được để trống'
        }).end();
    }

    Account.find({
        email: email
    }, (err, acc) => {
        if (err) {
            return next(err);
        } else if (acc.length > 0) {
            return res.json({
                success: false,
                message: 'Lỗi: Email đã tồn tại!'
            });
        } else {
            Account.find({
                username: username
            }, (err, acc) => {
                if (err) {                    
                    return next(err);
                } else if (acc.length > 0) {
                    return res.json({
                        success: false,
                        message: 'Lỗi: Tên tài khoản đã tồn tại!'
                    });
                } else {                    
                    // Save the new user
                    const newAcc = new Account();                    
                    newAcc.username = username;
                    newAcc.password = newAcc.generateHash(password);
                    newAcc.fullname = fullname;                    
                    newAcc.email = email;
                    newAcc.phone = phone;
                    newAcc.address = address;
                    newAcc.save((err, acc) => {
                        if (err) {return next(err)};
                        return res.json({
                            success: true,
                            message: 'Tạo tài khoản thành công'
                        }); 
                    });
                }
            });
        }
    });    
});

/* LOGOUT */
router.get('/logout', (req, res, nexr) => {
    const { query } = req;
    const { token } = query;
    //console.log(token);
    UserSession.findOneAndUpdate({
        _id: new ObjectId(token),
        isDeleted: false
    }, {
        $set: { isDeleted: true }
    }, null, (err, session) => {
        if (err) {
            return next(err);
        }
        
        return res.json({
            success: true,
            message: 'OK'
        }).end();        
    });
});

router.get('/getInfo/:username', checkAuth, (req, res, next) => {
    //console.log(req.params.id);
    const username = req.params.username
    Account.find({
        username: username
    }, (err, acc) => {
        if (err) {
            return next(err)
        }
        else {
            //console.log(acc);
            return res.json({
                success: true, detail: acc
            })
        }
    });
})

router.get('/getOrder/:username', checkAuth, (req, res, next) => {
    const username = req.params.username;
    //console.log(req.params.username);
    var query = {
        accountID: req.params.username,
        status: 1
    };
    AuctionTicket.aggregate([
        {
            $match: query
        },
        {
            $lookup: {
                from: 'auction_session',
                localField: 'sessionID',
                foreignField: 'sessionID',
                as: 'au'
            }
        },
        {
            $unwind: "$au"
        },
        {
            $lookup: {
                from: 'product',
                localField: 'au.productID',
                foreignField: '_id',
                as: 'p'
            }
        },
        {
            $unwind: "$p"
        },
        {
            $project: {
                _id: 1,
                sessionID: 1,
                "au.currentPrice": 1,
                "au.productID": 1,
                "p.productName": 1,
                "p.description": 1
            }
        }

    ], (err, result) => {
        if (err) {
            return next(err);
        }
        //console.log(result);
        return res.json(result);
    });
})

router.get('/getOrderStatus/:username', checkAuth, (req, res, next) => {
    var query = {
        accountID: req.params.username,
        status: { $in: [2, 3, 4, 5]}
    }
    AuctionTicket.aggregate([{
            $match: query
        },
        {
            $lookup: {
                from: 'auction_ticket_status',
                localField: 'status',
                foreignField: 'statusID',
                as: 'ats'
            }
        },
        {
            $unwind: "$ats"
        },
        {
            $lookup: {
                from: 'auction_session',
                localField: 'sessionID',
                foreignField: 'sessionID',
                as: 'au'
            }
        },
        {
            $unwind: "$au"
        },
        {
            $lookup: {
                from: 'product',
                localField: 'au.productID',
                foreignField: '_id',
                as: 'p'
            }
        },
        {
            $unwind: "$p"
        },
        {
            $project: {
                _id: 1,
                sessionID: 1,
                status: 1,
                "ats.statusName": 1,
                "au.currentPrice": 1,
                "au.productID": 1,
                "au.startTime": 1,
                "p.productName": 1,
                "p.description": 1
            }
        }

    ], (err, result) => {
        if (err) {
            return next(err);
        }
        //console.log(result);
        return res.json(result);
    });
})
router.post('/updateOrder', checkAuth, (req, res, next) => {
    if (req.body.getL.length != 0)
        AuctionTicket.updateMany(
            {
                _id: { $in: req.body.getL }
            }, 
            {
                $set: {
                    status: 2
                }
            }, (err, result) => {
                if (err) console.log(err);
                else {
                    if (req.body.delL.length != 0) {
                        AuctionTicket.updateMany({
                                _id: {
                                    $in: req.body.delL
                                }
                            }, {
                                $set: {
                                    status: 3
                                }
                            }, (err, result2) => {
                                if (err) console.log(err);
                                else return res.json({
                                    success: true
                                });
                            }

                        )
                    }
                    else {
                        return res.json({
                            success: true
                        });
                    }
                } 
            }
        )
    
})
router.post('/updateOrderStatus', checkAuth, (req, res, next) => {
    //console.log(req.body);
    if (req.body.list.length != 0)
        AuctionTicket.updateMany({
            _id: {
                $in: req.body.list
            }
        }, {
            $set: {
                status: 3
            }
        }, (err, result) => {
            if (err) console.log(err);
            else return res.json({
                success: true,
                count: result.nModified
            });
        })
})
router.post('/update', checkAuth, (req, res, next) => {
    var set = {
        username: req.body.username,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        fullname: req.body.fullname
    }

    // Chỉ khi client nhập pass thì mới thêm cái này.
    if (req.body.password != "") { 
        set.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
    }

    Account.updateOne({
        username: req.body.id}, 
        {
            $set: set
        }, (err, count) => {
            if (err) {
                return next(err)
            }
            else {
                res.json({
                    success: count.nModified == 1 ? true : false
                })
            }
        })
})

router.get('/gettype/:username', checkAuth, (req, res, next) => {
    
    Account.find({username: req.params.username}, (err, acc) => {
        if (err) {
            console.log(err);
            return "Something bad happened, try again later!";
        }
        else {
            return res.json({
                success: true,
                acc: acc
            })
        }
    })
})

module.exports = router;