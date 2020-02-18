const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//import mongoose from 'mongoose';
//import bcrypt from 'bcrypt';

const AccountSchema = new mongoose.Schema({
    username: String,
    password: String,
    fullname: String,
    email: String,
    phone: String,
    address: String,
    accountType: {
        _id: {
            type: Number,
            default: 1
        },
        name: {
            type: String,
            default: "user"
        }
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, { collection: 'account' });

AccountSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

AccountSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Account', AccountSchema);
//export default mongoose.model('Account', AccountSchema);