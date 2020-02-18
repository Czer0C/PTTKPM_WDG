const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productID: {
        type: String,
        default: ''
    },
    productName: {
        type: String,
        default: ''
    },
    productType: {        
        type: String,
        default: ''        
    },
    description: {
        type: String,
        default: ''
    },
    productImage: {
        type: String,
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { collection: 'product' });

module.exports = mongoose.model('Product', ProductSchema);