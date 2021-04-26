const postModel =  require('../models/post.model')
const dpmentModel = require('../models/department.model')
const unreadNotifiModel = require('../models/unreadNotifi.model')
const { multipleMongooseToObject } = require('../../util/mongoose')

class NotificationsController{

    // [GET] /
    async index(req, res, next){
        
        let search = req.query.search ? {$regex: req.query.search, $options:"$i"} : {$ne: null}; // Dùng $options:"$i" để ko phân biệt chữ hoa hay thường
        let dpment = (req.query.dpment && req.query.dpment != "common") ? req.query.dpment : {$ne: null};
        let {from, to} = req.query;
        let hideSeen = req.query.hideSeen ? true : false;
        let page = parseInt(req.query.page);
        let perPage = 10;

        var date = {$ne: null};
        if (from && to){
            date = {$gte:new Date(from).toISOString(), $lte:new Date(to).toISOString()}
        }
        else if(from) {
            date = {$gte:new Date(from).toISOString()}
        }
        else if(to) {
            date = {$lte:new Date(to).toISOString()}
        }
        
        var query = {
            name: search,
            createdAt: date,
            "department.id": dpment 
        };
        if (hideSeen){// nếu chọn "chỉ hiện chưa xem" => lấy các unread-notifications
            var idUnreadPost;
            await unreadNotifiModel.find({
                // unreadNotifiModel.find({}) trả về promise
                //  => .then() không biết khi nào mới làm xong
                // khi thêm chữ "await" đằng trước nó
                // => nghĩa là mình bắt máy phải đợi .then() chạy xong , 
                // nó mới chạy mấy dòng tiếp theo . là từ dòng này trở đi:  query = {_id : { $in: idUnreadPost} };
                // để sài được cái "await" này. cái function bao bọc nó phải có chữ "async"
                receiverId: req.user.username, 
                title: search, 
                postCreatedAt: date, 
                "department.id": dpment
            })
            .then((unreadNotifi) => {                    
                idUnreadPost = unreadNotifi.map( un => {// chỉ lấy id của các unread-notifications
                    return un.postId; 
                })
            })
            query = {// => chỉ cần kiếm các post có trùng id với unread-notifications là được rồi
                _id : { $in: idUnreadPost} 
            };
        }

        console.log( "query ",query)

        postModel.find(query)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({createdAt: -1})
        .then((notifications) => {
            req.notifications = notifications;
            return dpmentModel.find();
        })
        .then((departments) => {
            req.departments = departments;
            const curQuery = {
                search: (req.query.search ? req.query.search : "" ),
                dpment: (req.query.dpment ? req.query.dpment : "" ),
                from: (req.query.from ? req.query.from : ""),
                to: (req.query.to ? req.query.to : ""),
                hideSeen: (req.query.hideSeen ? req.query.hideSeen : ""),
            }
            var otherQuery = ''
            Object.keys(curQuery).forEach((key) => {
                otherQuery = otherQuery.concat(`&${key}=${curQuery[key]}`);
            });
            
            return res.render('all-notification', { 
                posts: multipleMongooseToObject(req.notifications),
                user: req.user,
                departments: multipleMongooseToObject(req.departments),
                curQuery,
                otherQuery
            })        
        })
        .catch((err) => {console.log("Lỗi: ", err)});
          
    }

    // [GET] /departments
    departmentPage(req, res, next){ 
        dpmentModel.find()
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