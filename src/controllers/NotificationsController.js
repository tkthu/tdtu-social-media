const postNofi =  require('../models/post.model')
class NotificationsController{

    // [GET] /
    index(req, res){      
        
        postNofi.find({department: {$ne: null}})
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
                    imagesArray: post.imagesArray,
                    attachmentsArray: post.attachmentsArray,
                    commentsCount: post.commentsCount,
                    department: post.department,
                    sender: post.sender,
                }
            })            
            res.render("all-notification",{user: req.user,posts});
        })             
        .catch(err => {
            return res.end("somthing went wrong ... | "+err);
        })
        
    }


    
    // [GET] /departments
    departmentPage(req, res){        
        res.render("phongban",{user: req.user});
    }

}

module.exports = new NotificationsController;