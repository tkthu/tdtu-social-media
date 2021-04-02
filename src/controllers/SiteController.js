const userModel = require('../models/user.model');
const postModel = require('../models/post.model');
const commentModel = require('../models/comment.model');
const unreadNotifiModel = require('../models/unreadNotifi.model');

const {multipleMongooseToObject} = require('../../util/mongoose')

class SiteController{

    // [GET] /
    index(req, res){

        unreadNotifiModel.find({receiverId: req.user.username})
        .then(notifisFound => {
            if (notifisFound === null){
                throw new Error('not found notifications');
            }
            console.log("notifisFound ", notifisFound)
            req.unreadNotifis = multipleMongooseToObject(notifisFound);

            return postModel.find({});
        })
        .then( postsFound => {
            if (postsFound === null){
                throw new Error('not found posts');
            }
            var posts = multipleMongooseToObject(postsFound);

            posts.map(post => {
                commentModel.find({postId:post._id})
                .then((commentArr) => {
                    post.comments = commentArr.map((comment) => {
                        return {
                            content: comment.content,
                            createdAt: comment.createdAt,
                            lastEdited: comment.lastEdited,
                            imageUrl: comment.imageUrl,  
                            sender: comment.sender,
                        }
                    });
                })
            })
            res.render("home",{user: req.user,posts, unreadNotifis: req.unreadNotifis});
        })
        .catch(err => {
            return res.end("somthing went wrong ... | "+err);
        })
    }

    // [GET] /:userId
    userPage(req, res){
        const userId = req.params.userId;
        userModel.findById(userId)
        .then((userFound) => {
            if (userFound == null) {// không tìm thấy user  
                throw new Error('not found user')
            }
            const pageOwner = {
                username: userFound.username,
                avatarUrl: userFound.avatarUrl,
                displayName: userFound.displayName,
            }

            postModel.find({"sender.id":pageOwner.username})
            .then( postsFound => {
                if (postsFound === null){
                    throw new Error('not found posts')
                }
                var posts = postsFound.map( post => {                
                    return {
                        _id: post._id,
                        name: post.name,
                        content: post.content,                
                        createdAt: post.createdAt,
                        lastEdited: post.lastEdited,
                        commentsCount: post.commentsCount,
                        department: post.department,
                        sender: post.sender,
                        imagesArray: post.imagesArray,
                        attachmentsArray: post.attachmentsArray,
                    }

                })

                posts.map(post => {
                    
                    commentModel.find({postId:post._id})
                    .then((commentArr) => {
                        post.comments = commentArr.map((comment) => {
                            return {
                                content: comment.content,
                                createdAt: comment.createdAt,
                                lastEdited: comment.lastEdited,
                                imageUrl: comment.imageUrl,  
                                sender: comment.sender,
                            }
                        });
                    })
                })
                return res.render("personal",{user: req.user, pageOwner,posts});
            })
            
        })
        .catch(err => {
            return res.end("somthing went wrong ... | "+err);
        }) 
    }

    // [GET] /:userId/posts/:postId
    postDetail(req, res) {
        const userId = req.params.userId;
        const postId = req.params.postId;        

        postModel.findOne({
            _id: postId,
            "sender.id": userId,
        })
        .then((postFound)=>{
            if (postFound === null) {// không tìm thấy post           
                throw new Error('not found post')
            }

            //delete unread-notifications
            unreadNotifiModel.findOneAndDelete({postId, receiverId: req.user.username })
            .then( delNotifi => {
                console.log(" đã đọc thông báo ",delNotifi)
            })

            req.post = {
                _id: postFound._id,
                name: postFound.name,
                content: postFound.content,                
                createdAt: postFound.createdAt,
                lastEdited: postFound.lastEdited,
                commentsCount: postFound.commentsCount,
                department: postFound.department,
                sender: postFound.sender,
                imagesArray: postFound.imagesArray,
                attachmentsArray: postFound.attachmentsArray,
            }
            
            return commentModel.find({postId});    
        })
        .then((commentArr) => {
            req.post.comments = commentArr.map((comment) => {
                return {
                    content: comment.content,
                    createdAt: comment.createdAt,
                    lastEdited: comment.lastEdited,
                    imageUrl: comment.imageUrl,  
                    sender: comment.sender,
                }
            });
            return res.render("detail-notification",{user: req.user,post:req.post});
        })
        .catch(err => {
            return res.end("somthing went wrong ... | "+err);
        }) 
    
        
    }

}

module.exports = new SiteController;