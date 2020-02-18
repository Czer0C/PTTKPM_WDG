// import express, {Router} from "express";
// import {urlencoded,	json} from "body-parser";
// import Product from '../models/Product';
// import AuctionSession from '../models/AuctionSession';
// import AuctionSessionStatus from '../models/AuctionSessionStatus';
// import AuctionTicket from '../models/AuctionTicket';
// import AuctionTicketStatus from '../models/AuctionTicketStatus';
// import Account from '../models/Account';
// import Parameter from '../models/Parameter';
// import mongoose from 'mongoose';
const express = require('express');
const { Router } = express;
const bodyParser = require('body-parser');
const { urlencoded, json } = bodyParser;
const mongoose = require('mongoose');

const Product = require('../models/Product');
const AuctionSession = require('../models/AuctionSession');
const AuctionSessionStatus = require('../models/AuctionSessionStatus');
const AuctionTicket = require('../models/AuctionTicket');
const AuctionTicketStatus = require('../models/AuctionTicketStatus');
const Account = require('../models/Account');
const Parameter = require('../models/Parameter');

const router = Router();
const app = express();
const checkAuth = require('../middleware/check-auth');
const bcrypt = require('bcrypt');

app.use(urlencoded({
	'extended': 'false'
}));
app.use(json());

router.get('/getProduct', checkAuth, (req, res, next) => {
	Product.aggregate([{
		$lookup: {
			from: 'auction_session',
			localField: '_id',
			foreignField: 'productID',
			as: 'as'
		}
	}], (err, r) => {
		if (err) console.log(err);
		else {
			return res.json({
				list: r
			});
		}
	});
});

router.delete('/deleteProduct', checkAuth, (req, res, next) => {
	//console.log(req.body.val);
	Product.updateOne({
		"_id": req.body.key
	}, {
		$set: {
			isDeleted: req.body.val
		}
	}, (err, count) => {
		if (err) return next(err);
		else {
			//console.log(count);
			return res.json({ success: count.nModified == 1 ? true : false });
		}
	})
});

router.put('/updateProduct', checkAuth, (req, res, next) => {
	//console.log(req.body);
	Product.updateOne({
		"_id": req.body.key
	}, {
		$set: {
			productName: req.body.val[0],
			productType: req.body.val[1],
			description: req.body.val[2],
			productImage: req.body.val[3]
		}
	}, (err, count) => {
		if (err) return next(err);
		else {
			//console.log(count);
			return res.json({
				success: count != null ? true : false
			});
		}
	})
});

router.post('/addProduct', checkAuth, (req, res, next) => {
	Product.find({
		productType: req.body.val[1]
	}, (err, out) => {
		if (err) return next(err);
		else {
			var count = out.length + 1;
			var pID = ("000" + count).substr(("000" + count).length - 3);
			//console.log(pID);
			const p = new Product();
			p.productName = req.body.val[0];
			p.productType = req.body.val[1];
			p.description = req.body.val[2];
			p.productImage = req.body.val[3];
			p.productID = pID;
			p.save((err, data) => {
				if (err) return next(err);
				else {
					return res.json({
						success: data != null ? true : false
					});
				}
			});
		}
	})
});

router.get('/productListAU', checkAuth, (req, res, next) => {
	Product.aggregate([{
		$project: {
			_id: 1,
			productName: 1
		}
	}], (err, out) => {
		if (err) return next(err);
		else {
			return res.json({
				plist: out
			});
		} 

	})
});

router.get('/auction', checkAuth, (req, res, next) => {	
	AuctionSession.aggregate([
		{
			$lookup: {
				from: "product",
				localField: "productID",
				foreignField: '_id',
				as: 'p'
			}
		},
		{
			$unwind: "$p"
		},
		{
			$lookup: {
				from: "auction_session_status",
				localField: "status",
				foreignField: "statusID",
				as: "aus"
			}
		},
		{
			$unwind: "$aus"
		},
		{
			$project: {
				_id: 1,
				sessionID: 1,
				startTime: 1,
				status: 1,
				initPrice: 1,
				currentPrice: 1,
				bidTime: 1,
				isDeleted: 1,
				"p.productName": 1,
				"p._id": 1,
				"aus.statusName": 1
			}
		}], (err, out) => {
			
			if (err) return next(err);
			else {
				return res.json({list: out});
			}
		}
	)
});
router.post('/auction', checkAuth, (req, res, next) => {
	//console.log(req.body);
	const MongoClient = require('mongodb').MongoClient;
	const url = "mongodb://localhost:27017/";
	var ObjectId = mongoose.Types.ObjectId;
	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var dbo = db.db("chidori");
		dbo.collection("auction_session").count((err, c) => {
			if (err) return next(err);
			else {
				dbo.collection("auction_session").insert({
					"sessionID": (++c).toString(), // mã phiên tăng tự động
					"productID": new ObjectId(req.body.val[3]),
					"startTime": "",
					"bidTime": req.body.val[0],
					"initPrice": req.body.val[2],
					"currentPrice": req.body.val[2],
					"status": req.body.val[1],
					"__v": 0,
					"isDeleted": false
				}, (err, n) => {
					if (err) console.log(err);
					else {
						db.close();
						return res.json({
							success: n.result.ok == 1 ? true : false
						});
					}
				});
				db.close();
			}
		})
	})
});
router.post('/beginAuction', checkAuth, (req, res, next) => {
	AuctionSession.updateOne({
		"_id": req.body.key
	}, {
		$set: {
			status: 1,
			startTime: Date.now()
		}
	}, (err, count) => {
		if (err) return next(err);
		else {
			//console.log(count);
			return res.json({
				success: count.nModified == 1 ? true : false
			});
		}
	})
});
router.put('/auction', checkAuth, (req, res, next) => {
	//console.log(req.body);
	const MongoClient = require('mongodb').MongoClient;
	const url = "mongodb://localhost:27017/";
	var ObjectId = mongoose.Types.ObjectId;
	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var dbo = db.db("chidori")
		var newData = {
			"bidTime": req.body.val[0],
			"status": req.body.val[1],
			"initPrice": req.body.val[2],
			"currentPrice": req.body.val[2],
			"productID": new ObjectId(req.body.val[3])
		}
		
		var query = {
			_id: new ObjectId(req.body.key)
		};
		dbo.collection("auction_session").findOneAndUpdate(
			query, {$set: newData}, (err, out) => {
				if (err) console.log(err);
				else {
					//console.log(out.ok);
					db.close();
					return res.json({
						success: out.ok == 1 ? true : false
					});
				}
			}
		)
	});
});
router.delete('/auction', checkAuth, (req, res, next) => {
	AuctionSession.updateOne({
		"_id": req.body.key
	}, {
		$set: {
			isDeleted: req.body.val
		}
	}, (err, count) => {
		if (err) return next(err);
		else {
			//console.log(count);
			return res.json({
				success: count.nModified == 1 ? true : false
			});
		}
	});
});
router.get('/ticket', checkAuth, (req, res, next) => {
	AuctionTicket.aggregate([
		{
			$match: {
				status: {$in: [1, 2, 3, 4, 5, 6]}
			}
		},
		{
			$lookup: {
				from: "auction_ticket_status",
				localField: "status",
				foreignField: "statusID",
				as: 'ats'
			}
		},
		{
			$unwind: "$ats"
		},
		{
			$project: {
				_id: 1,
				accountID: 1,
				bidValue: 1,
				sessionID: 1,
				status: 1,
				"ats.statusName": 1,
				isDeleted: 1
			}
		}], (err, out) => {
		if (err) return next(err);
		else {
			return res.json({
				success: true,
				tlist: out
			});
		}
	});
});

router.post('/delivery', checkAuth, (req, res, next) => {
	AuctionTicket.updateOne(
		{
			_id: req.body.key
		}, 
		{
			$set: {
				status: 4
			}
		}, (err, result) => {
			if (err) console.log(err);
			else return res.json({
				success: true,
				count: result.nModified
			});
		}
	);
});

router.delete('/ticket', checkAuth, (req, res, next) => {
	const MongoClient = require('mongodb').MongoClient;
	const url = "mongodb://localhost:27017/";
	var ObjectId = mongoose.Types.ObjectId;
	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		var dbo = db.db("chidori")
		
		var query = {
			_id: new ObjectId(req.body.key)
		};
		dbo.collection("auction_ticket").findOneAndUpdate(
			query, {
				$set: {isDeleted: req.body.val}
			}, (err, out) => {
				if (err) console.log(err);
				else {
					//console.log(out.ok);
					db.close();
					return res.json({
						success: out.ok == 1 ? true : false
					});
				}
			}
		)
	});
});

router.get('/user', checkAuth, (req, res, next) => {
	Account.find({}, (err, out) => {
		if (err) return next(err);
		else {
			res.json({
				list: out
			});
		}
	});
});
router.post('/user', checkAuth, (req, res, next) => {
	Account.find({
		email: req.body.user.updateEmail
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
			username: req.body.user.updateName
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
				newAcc.username = req.body.user.updateName;
				newAcc.password = newAcc.generateHash(req.body.user.updatePass);
				newAcc.fullname = req.body.user.updateFullname;
				newAcc.email = req.body.user.updateEmail;
				newAcc.phone = req.body.user.updatePhone;
				newAcc.address = req.body.user.updateAddress;
				newAcc.accountType = {
					_id: req.body.user.updateType == 'user' ? 1 : 0,
					name: req.body.user.updateType
				}
				newAcc.save((err, acc) => {
					if (err) {
						return next(err)
					};
					return res.json({
						success: true,
						message: 'Tạo tài khoản thành công'
					});
				});
			}
		});
	}
	});

})
router.put('/user', checkAuth, (req, res, next) => {
	//console.log(req.body.user);
	var set = {
		username: req.body.user.updateName,
		fullname: req.body.user.updateFullname,
		email: req.body.user.updateEmail,
		phone: req.body.user.updatePhone,
		address: req.body.user.updateAddress,
		accountType: {
			_id: req.body.user.updateType == 'user' ? 1 : 0,
			name: req.body.user.updateType
		}
	}
	if (req.body.user.updatePass != "") {
		set.password = bcrypt.hashSync(req.body.user.updatePass, bcrypt.genSaltSync(8), null)
	}
	Account.find({
		_id: req.body.key
	}, (err, out) => {
		if (err) return next(err);
		else {
			if (out.length == 1) {
				Account.updateOne({
					"_id": req.body.key
				}, {
					$set: set
				}, (err2, count) => {
					if (err2) return next(err2);
					else {
						return res.json({
							success: count.ok == 1 ? true : false,
							message: count.ok == 1 ? "" : "Cập nhật thất bại!"
						});
					}
				})
			}
			else {
				return res.json({
					success: false,
					message: "Không tìm thấy tài khoản"
				})
			}
		}
	})
})

router.get('/parameters', checkAuth, (req, res, next) => {
	Parameter.find({}, (err, out) => {
		if (err) return next(err);
		else {
			return res.json({
				success: true,
				list: out
			})
		}
	})
})

router.post('/parameters', checkAuth, (req, res, next) => {
	Parameter.count({}, (err, out1) => {
		if (err) return next(err)
		else {
			const newP = new Parameter();
			newP.pID = out1;
			newP.pName = req.body.p.pName;
			newP.pValue = req.body.p.pValue;
			newP.save((err2, out2) => {
				if (err2) return next(err2)
				else {
					return res.json({
						success: true,
						message: "Thêm thành công"
					})
				}
			});
		}
	})
})

router.put('/parameters', checkAuth, (req, res, next) => {
	//console.log(req.body.key)
	Parameter.updateOne({
		_id: req.body.key
	}, {
		$set: {
			pName: req.body.p.pName,
			pValue: req.body.p.pValue
		}
	}, (err, out) => {
		if (err) return next(err);
		else {
			return res.json({
				success: true
			})
		}
	})
})

router.get('/chartData', checkAuth, (req, res, next) => {
	var userData = [];
	var saleData = [];
	Account.aggregate(
		[{
			$group: {
				_id: "$accountType.name",
				count: {
					$sum: 1
				}
			}
		}], (err, out) => {
			if (err) return next(err);
			userData = out;
			AuctionSession.aggregate([
				{
					$match: {
						status: -1
					}
				},
					{
						$lookup: {
							from: "product",
							localField: "productID",
							foreignField: "_id",
							as: "p"	
						}
					},
					{
						$group: {
							_id: "$p.productType",
							count: {
								$sum: "$currentPrice"
							}
						}
					}
				], (err2, out2) => {
					if (err2) return next(err2)
					else {
						saleData = out2
						AuctionSession.find({status: -1}, (err3, out3) => {
							if (err3) return next(err3);
							Product.find({}, (err4, out4) => {
								if (err4) return next(err4);
								return res.json({
									success: true,
									userData: userData,
									saleData: saleData,
									totalAuction: out3.length,
									totalProduct: out4.length
								})
							})
						});
					}
				})		
		}
	)
	
})

module.exports = router;