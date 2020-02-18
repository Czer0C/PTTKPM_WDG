const mongoose = require('mongoose');

const AuctionTicketStatusSchema = new mongoose.Schema({
    statusID: {
        type: Number,
        default: 0 // 0: đang đấu | 1: thắng | -1: thua | 2: đặt hàng | 3: hủy đặt hàng | 4: đang giao hàng | 5 hủy giao hàng | 6: đã nhận hàng | 7: trả hàng
    },
    statusName: {
        type: String,
        default: 'Đang đấu'
    }
}, {collection: 'auction_ticket_status'});

module.exports = mongoose.model('AuctionTicketStatus', AuctionTicketStatusSchema);