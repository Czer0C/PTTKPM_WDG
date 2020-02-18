//import mongoose, { Collection } from 'mongoose';
const mongoose = require('mongoose');

const AuctionSesstionStatusSchema = new mongoose.Schema({
    statusID: {
        type: Number,
        default: 0 // 0: chưa bắt đầu | 1: bắt đầu | -1: kết thúc
    },
    statusName: {
        type: String,
        default: 'Chưa bắt đầu'
    }
}, { collection: 'auction_session_status' });

module.exports = mongoose.model('AuctionSesstionStatus', AuctionSesstionStatusSchema);
//export default mongoose.model('AuctionSesstionStatus', AuctionSesstionStatusSchema);