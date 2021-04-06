const postNofi =  require('../models/post.model')
const commentModel = require('../models/comment.model');
class NotificationsController{

    // [GET] /
    index(req, res){      
        
        postNofi.find({})
        .then( postsFound => {
            if (postsFound === null){
                throw new Error('not found posts')
            }
            var posts = postsFound.map( post => {  // ông psu hlen6 thử. để tui coi máy tui chạy được ko okieelaaa push rồi á
                

                return {// ông trueyn26 cái này vô. thì giờ lấy ra sài thôi
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
            console.log("postsFound ", postsFound)// dòng này chạy được mà
            res.render("all-notification",{postsFound});// ông truyền postsFound vào all-notification.hbs
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