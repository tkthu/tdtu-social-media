const Users = require('../models/user.model')
const Departments = require('../models/department.model')
const { multipleMongooseToObject } = require('../../util/mongoose')
const bcrypt = require('bcrypt')
const mogoose = require('mongoose')

class ManagerController{    

    // [GET] /staffs
    staffsPage(req, res, next){    
        let search = req.query.search ? {$regex:req.query.search} : {$ne: null};
        let page = parseInt(req.query.page);
        let perPage = 10;

        Users.find({userType: "staff", username: search})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then((users) => {
            req.users = users;
            return Departments.find();
        })
        .then((departments) => {
            Users.countDocuments((err, count) => {
                if(err) return next(err);
                res.render('admin-acc-phong-khoa', { 
                    department: multipleMongooseToObject(departments),
                    user: req.user,
                    users: multipleMongooseToObject(req.users),
                    current: page ? page : 1,
                    pages: Math.ceil(count / perPage),
                    otherQuery: `search=${ search ? search : "" }`
                })
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
            res.redirect('/manager/staffs')
        })
        .catch(err => {
            return res.status(500).json({
                msg:'Thêm mới staff thất bại với lỗi ' + err,
            });
        })
    }

}

module.exports = new ManagerController;