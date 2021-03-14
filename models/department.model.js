const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Department = new Schema({
    _id:{ type: String},
    name: { type: String },
    avatarUrl: { type: String , default: "/img/logo tdt.png" },
});

module.exports = mongoose.model('Department', Department);