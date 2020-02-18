const mongoose = require('mongoose');

const ParameterSchema = new mongoose.Schema({
    pID: {
        type: Number,
        default: ''
    },
    pName: {
        type: String,
        default: ''
    },
    pValue: {
        type: Number,
        default: 0
    }
}, {collection: 'parameter'});

module.exports = mongoose.model('Parameter', ParameterSchema);