const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UnreadNotifi = new Schema({
    _id: { type: Schema.Types.ObjectId},
    senderId: { type: String },
    postId:{ type: Schema.Types.ObjectId},
    receiverId: { type: String },
    title: { type: String },
    department: { type: String },
    postCreatedAt: { type: String },
});

module.exports = mongoose.model('unread-notification', UnreadNotifi);