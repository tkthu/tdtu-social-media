const userModel = require('../models/user.model');
const postModel = require('../models/post.model');
const commentModel = require('../models/comment.model');

class SiteController{

    // [GET] /
    index(req, res){

        postModel.find({})
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
            console.log(req.user)
            res.render("home",{user: req.user,posts});
        })
        .catch(err => {
            console.log(err)
            return res.end("somthing went wrong ... | "+err);
        })
    }

    // [GET] /:userId
    userPage(req, res){
        const userId = req.params.userId;
        console.log("userId = " + userId);
        userModel.findById(userId)
        .then((userFound) => {
            console.log(userFound)
            if (userFound == null) {// không tìm thấy user  
                throw new Error('not found user')
            }
            const pageOwner = {
                username: userFound.username,
                avatarUrl: userFound.avatarUrl,
                displayName: userFound.displayName,
            }
            return res.render("personal",{user: req.user, pageOwner});
        })
        .catch(err => {
            console.log(err)
            return res.end("somthing went wrong ... | "+err);
        }) 
    }

    // [GET] /:userId/posts/:postId
    postDetail(req, res) {
        const userId = req.params.userId;
        const postId = req.params.postId;
        console.log("userId = " + userId + " | postId = " + postId);
        
        postModel.findOne({
            _id: postId,
            "sender.id": userId,//
        })
        .then((postFound)=>{
            if (postFound === null) {// không tìm thấy post           
                throw new Error('not found post')
            }

            req.post = {
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
            console.log(err)
            return res.end("somthing went wrong ... | "+err);
        }) 
    
        
    }

}

module.exports = new SiteController;