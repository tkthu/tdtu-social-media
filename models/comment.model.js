const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Comment = new Schema({    
    _id:{ type: Schema.Types.ObjectId},
    content: { type: String},
    createdAt: { type: String, default: new Date().toISOString() },
    lastEdited: { type: String, default: new Date().toISOString() },
    imageUrl: { type: String},    
    sender: {
        id: {type: String},
        displayName: {type: String},
        avatarUrl: {type: String},
    },
    postId:{ type: Schema.Types.ObjectId},
});

module.exports = mongoose.model('Comment', Comment);