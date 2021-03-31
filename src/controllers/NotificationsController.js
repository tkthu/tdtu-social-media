const post =  require('../models/post.model')
class NotificationsController{

    // [GET] /
    index(req, res){      
        post.find({})
            .then(post => {
                if (post === null){
                    throw new Error('not found posts')
                }
               

                res.render('all-notification',{ 
                    post : multipleMongooseToObject(post)
                })
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