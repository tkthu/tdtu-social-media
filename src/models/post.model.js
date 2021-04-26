const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema({
    _id:{ type: Schema.Types.ObjectId},
    name: { type: String },
    content: { type: String ,default: ""},
    createdAt: { type: String, default: new Date().toISOString() },
    lastEdited: { type: String, default: undefined },
    imagesArray: {type: Array},
    attachmentsArray: {type: Array},
    videoIdArray: {type: Array},
    commentsCount: {type: Number, default: 0},
    department: {
        id: {type: String},
        name: {type: String},
    },
    sender: {
        id: {type: String},
        displayName: {type: String},
        avatarUrl: {type: String},
    }
    
});

module.exports = mongoose.model('Post', Post);