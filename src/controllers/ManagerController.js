const Users = require('../models/user.model')
const Departments = require('../models/department.model')
const { multipleMongooseToObject } = require('../../util/mongoose')
const bcrypt = require('bcrypt')
const mogoose = require('mongoose')

class ManagerController{    

    // [GET] /staffs
    staffsPage(req, res, next){    
        var data;

        Users.find({userType: "staff"})
        .then((users) => {
            req.users = users;
            var {search, page} = req.query
            // console.log(search, page)
            data = multipleMongooseToObject(req.users).find((user) => {
                var result = user.displayName.toLowerCase();
                // if(result.indexOf(search) !== -1) {
                //     data.push(result)
                // }
                // console.log(result.indexOf(search))
                return result.indexOf(search) !== -1
            })
            // console.log(data)
            console.log(search)
            return Departments.find();
        })
        .then((departments) => {
            res.render('admin-acc-phong-khoa', { 
                department: multipleMongooseToObject(departments),
                user: req.user,
                users: multipleMongooseToObject(req.users),
                users: data
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
        var authorized = []
        var obj, temp;
        if(Array.isArray(req.body.chuyenmuc)) {
            for (let cm in req.body.chuyenmuc) {
                temp = req.body.chuyenmuc[cm].split('_')
                obj = {
                    id: temp[0],
                    name: temp[1]
                }
                authorized.push(obj)
            }
        }   
        else {
            temp = req.body.chuyenmuc.split('_')
            obj = {
                id: temp[0],
                name: temp[1]
            }
            authorized.push(obj)
        }

        const addStaff = {
            _id: mogoose.Types.ObjectId(),
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password,10),
            displayName: req.body.displayName,
            createdAt: new Date().toISOString(),
            staffInfo: {
                authorized
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