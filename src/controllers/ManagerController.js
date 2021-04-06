const Users = require('../models/user.model')
const Departments = require('../models/department.model')
const { multipleMongooseToObject } = require('../../util/mongoose')
const bcrypt = require('bcrypt')
const mogoose = require('mongoose')

class ManagerController{

    // [GET] /staffs
    staffsPage(req, res, next){    
        var {search} = req.query
        // var data = Users.Filter((item) => {
        //     return item.search
        // })    
        Users.find({userType: "staff"})
        .then((users) => {
            req.users = users;
            return Departments.find();
        })
        .then((departments) => {
            res.render('admin-acc-phong-khoa', { 
                department: multipleMongooseToObject(departments),
                user: req.user,
                users: multipleMongooseToObject(req.users),
                // data: data
            })
        })
        .catch(next);

        

    }

    // [POST] /staffs
    staffsAdd(req, res, next){
        var imagesArray = undefined;
        if(req.files.image !== undefined) {
            imagesArray = req.files.image.map( fi => {
                return fi.path.replace("public","");
            })
        }

        const addStaff = {
            _id: mogoose.Types.ObjectId(),
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password,10),
            displayName: req.body.displayName,
            createdAt: new Date().toISOString(),
            staffInfo: {
                authorized: req.body.chuyenmuc,
            },
            userType: "staff",
        }

        new Users(addStaff).save()
        .then((resultAdd) => {
            return res.status(200).json({
                code:0,
                msg:'Thêm staff thành công',
                data: {
                    addStaff
                }
            });
        })
        .catch(err => {
            return res.status(500).json({
                msg:'Thêm mới staff thất bại với lỗi ' + err,
            });
        })
    }
 
    // [GET] /students
    studentsPage(req, res, next){       
        Users.find({userType: "student"})  // Tìm user với userType là "student"
        .then((users) => {            
            res.render('admin-acc-student', {
                user: req.user,
                users: multipleMongooseToObject(users)
            });
        })
        .catch(next);
    }

}

module.exports = new ManagerController;