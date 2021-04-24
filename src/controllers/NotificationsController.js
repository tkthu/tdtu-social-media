const postNofi =  require('../models/post.model')
const Departments = require('../models/department.model')
const UnreadNotification = require('../models/unreadNotifi.model')
const { multipleMongooseToObject } = require('../../util/mongoose')

class NotificationsController{

    // [GET] /
    index(req, res, next){
        
        let search = req.query.search ? {$regex: req.query.search, $options:"$i"} : {$ne: null}; // Dùng $options:"$i" để ko phân biệt chữ hoa hay thường
        let dpment = req.query.dpment ? {$regex: req.query.dpment, $options:"$i"} : {$ne: null};
        let {from, to} = req.query;
        let hideSeen = req.query.hideSeen ? {$regex: req.query.hideSeen} : {$ne: null};

        var date;
        if(from) {
            date = {$gte:from}
        }
        else if(to) {
            date = {$lte:to}
        }
        else if(!from && !to) {
            date = {$ne: null}
        }
        else {
            date = {$gte:from, $lte:to}
        }
        
        postNofi.find({name: search, createdAt: date, "department.name": dpment })
            .then((notifications) => {
                req.notifications = notifications;
                return Departments.find();
            })
            .then((departments) => {
                UnreadNotification.find({receiverId: req.user.username})
                .then((unreadNotification) => {
                    req.unreadNotification = unreadNotification;
                    // if(hideSeen == "on") {
                    //     console.log(unreadNotification)
                    // }
                    res.render('all-notification', { 
                        posts: multipleMongooseToObject(req.notifications),
                        user: req.user,
                        department: multipleMongooseToObject(departments),
                        unreadPosts: multipleMongooseToObject(req.unreadNotification),
                    })
                })
                
            })

            .catch((err) => {console.log("Lỗi: ", err)});
          
    }

    // [GET] /departments
    departmentPage(req, res, next){ 
        Departments.find()
            .then((departments) => {
                res.render("phongban",{
                    dpments: multipleMongooseToObject(departments),
                    user: req.user
                });
            }) 
            .catch(next);
    }

}

module.exports = new NotificationsController;