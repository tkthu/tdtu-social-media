const userModel = require('../models/user.model')
const credentials = require('../credentials');

class LoginController{
    // [GET] /login
    index(req, res){
        res.render('login',{ username:'', password:'', errMsg:''});
    }

    // [POST] /login
    login(req, res){
        const {username, password} = req.body;        
        var errMsg = ''; 

        if (!password || !username){
            errMsg = "Chưa nhập đủ thông tin";
            return res.render("login", { username, password, errMsg})
        }

        userModel.findOne({username, password},(err,user)=>{
            if (err) return console.log('error: ' + err);
            else if (user === null) {
                errMsg = "Sai tên đăng nhập hoặc mật khẩu";
                return res.render("login", { username, password, errMsg})
            }
            //đăng nhập thành công
            console.log("đăng nhập thành công")
            // req.session.msg="Đăng nhập thành công";
            req.session.username = username
            return res.redirect(303,'/');
        })
        
    }

    // [POST] /login/GGAuth
    ggAuth(req, res){
        const {username, displayName, imageUrl} = req.body;        
        var errMsg = ''; 

        userModel.findById(username,(err,user)=>{
            if (err) return res.status(500).json('database failure');
            else if (user === null) {
                // user đăng nhập lần đầu => tạo mới user trong database
                new userModel({
                    _id: username,
                    username: username,
                    password: "[passHolder]",
                    displayName: displayName,
                    avatarUrl: imageUrl || '/img/no-face.png',
                    createdAt: new Date().toISOString(),
                    lastEdited: new Date().toISOString(),
                    staffInfo: undefined,
                    studentInfo: undefined
                }).save();
            }             
            // đăng nhập thành công
            console.log("đăng nhập = GG thành công")
            // req.session.msg="Đăng nhập bằng google thành công";
            req.session.username = username
            return res.status(200).json({
                msg: 'login with google successfully',
                url: credentials.url.dev
            });
        })

        
    }

}

module.exports = new LoginController;