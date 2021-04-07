const userModel = require('../models/user.model');
const postModel = require('../models/post.model');
const commentModel = require('../models/comment.model');
const unreadNotifiModel = require('../models/unreadNotifi.model');

const {multipleMongooseToObject, mongooseToObject} = require('../../util/mongoose')

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

            return res.render("home",{user: req.user, unreadNotifis: req.unreadNotifis});
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

            return res.render("personal",{user: req.user, pageOwner});
            
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

            //delete unread-notifications // không cần đợi
            unreadNotifiModel.findOneAndDelete({postId, receiverId: req.user.username })
            .then( delNotifi => {
                console.log(" đã đọc thông báo ",delNotifi);
            })

            const post = mongooseToObject(postFound);
            return res.render("detail-notification",{user: req.user,post}); 
        })
        .catch(err => {
            return res.end("somthing went wrong ... | "+err);
        }) 
    
        
    }

}

module.exports = new SiteController;