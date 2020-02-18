const mongoose = require('mongoose');

const AuctionTicketSchema = mongoose.Schema({
    sessionID: {
        type: String,
        default: ''
    },
    accountID: {
        type: String,
        default: ''
    },
    bidValue: {
        type: Number,
        default: 0        
    },
    bidTime: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        default: 0 // 0: đang đấu | 1: thắng | -1: thua | 2: nhận hàng | 3: hủy đơn hàng | 4: đã nhận hàng
    }
}, {collection: 'auction_ticket'});

module.exports = mongoose.model('AuctionTicket', AuctionTicketSchema);