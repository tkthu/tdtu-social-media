const userModel = require('../models/user.model');
const postModel = require('../models/post.model');
const commentModel = require('../models/comment.model');

class SiteController{

    // [GET] /
    index(req, res){
        res.render("home",{user: req.user});
    }

    // [GET] /:userId
    userPage(req, res){
        const userId = req.params.userId;
        console.log("userId = " + userId);
        //TODO: find user
        userModel.findById(userId,(err,userFound) => {
            if (err) return res.end('error: ' + err);
            else if (userFound === null) {// không tìm thấy user           
                return res.end('not found user')
            }
            const pageOwner = {
                username: userFound.username,
                avatarUrl: userFound.avatarUrl,
                displayName: userFound.displayName,
            }
            return res.render("personal",{user: req.user, pageOwner});
        });
    }

    // [GET] /:userId/posts/:postId
    postDetail(req, res) {
        const userId = req.params.userId;
        const postId = req.params.postId;
        console.log("userId = " + userId + " | postId = " + postId);
        
        postModel.findOne({
            _id: postId,
            "sender.id": userId,//
        },(err,postFound)=>{
            if (err) return console.log('error: ' + err);
            else if (postFound === null) {// không tìm thấy post           
                return res.end('not found post')
            }
            
            var post = {
                name: postFound.name,
                content: postFound.content,                
                createdAt: postFound.createdAt,
                commentsCount: postFound.commentsCount,
                department: postFound.department,
                sender: postFound.sender,
                imagesArray: postFound.imagesArray,
                attachmentsArray: postFound.attachmentsArray,
            }
            var comments = []
            commentModel.find({postId},(err,commentArr) => {
                if (err) return res.end('error: ' + err);
                comments = commentArr.map((comment) => {
                    return {
                        content: comment.content,
                        createdAt: comment.createdAt,
                        lastEdited: comment.lastEdited,
                        imageUrl: comment.imageUrl,  
                        sender: comment.sender,
                    }
                });
                post.comments = comments;
                return res.render("detail-notification",{user: req.user,post});

            });    
        });
        
    }

}

module.exports = new SiteController;