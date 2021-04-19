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
            _id: req.body.username,
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
        .then((resultAdd) => {// cái này . bà ko cần hiện json lên. bà redirect về /manager/staffs là được rồi
            // khi nào dùng ajax bà mới cần trả vầ json
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

}

module.exports = new ManagerController;