const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    _id:{ type: String},
    username: { type: String },
    password: { type: String },
    displayName: { type: String },
    avatarUrl: { type: String, default: "/img/no-face.png" },
    createdAt: { type: String, default: new Date().toISOString() },
    lastEdited: { type: String, default: new Date().toISOString() },
    staffInfo: {
        authorized: { type: Array },
    },
    studentInfo: {
        class: { type: String },
        faculty: { type: String },
    },
    userType: { type: String, default: "staff" },
});

module.exports = mongoose.model('User', User);