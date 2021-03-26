const Users = require('../models/user.model')
const { multipleMongooseToObject } = require('../util/mongoose')
class ManagerController{

    // [GET] /staffs
    staffsPage(req, res, next){        
        Users.find({userType: "staff"}) // Tìm user với userType là "staff"
        .then((users) => {
            console.log(multipleMongooseToObject(users))

            res.render('admin-acc-phong-khoa', {
                user: req.user,
                users: multipleMongooseToObject(users)
            });
        })
        .catch(next);
    }

    // [GET] /students
    studentsPage(req, res, next){       
        Users.find({userType: "student"})  // Tìm user với userType là "student"
        .then((users) => {
            console.log(multipleMongooseToObject(users))
            
            res.render('admin-acc-student', {
                user: req.user,
                users: multipleMongooseToObject(users)
            });
        })
        .catch(next);
    }

}

module.exports = new ManagerController;