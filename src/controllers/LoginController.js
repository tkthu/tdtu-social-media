const userModel = require('../models/user.model');
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt')

class LoginController{
    // [GET] /login
    index(req, res){

        if (req.session.username) {
            return res.redirect('/');
        }
    
        const errMsg = req.flash('error') || ''
        const password = req.flash('password') || ''
        const username = req.flash('username') || ''

        res.render('login',{ username, password, errMsg,layout:'no-header-layout'});
    }

    // [POST] /login
    login(req, res){
        let result = validationResult(req);

        if (result.errors.length !== 0) {
            result = result.mapped();
            let message;
            for (var fields in result) {
                message = result[fields].msg;
                break;
            }        
            
            req.flash('error', message);
            req.flash('password', req.body.password);
            req.flash('username', req.body.username);
            
            return res.redirect('/login');
        }

        const {username, password} = req.body;
        
        userModel.findOne({username})
        .then((user)=>{
            if (user === null) {
                req.flash('error', "username không tồn tại");
                req.flash('password', req.body.password);
                req.flash('username', req.body.username);      
                return res.redirect('/login');
            }
            return bcrypt.compare(password, user.password);
        })
        .then(passwordMatch => {
            if (!passwordMatch) {
                req.flash('error', "password sai");
                req.flash('password', req.body.password);
                req.flash('username', req.body.username);         
                return res.redirect('/login');
            }
            //đăng nhập thành công
            console.log("đăng nhập thành công")
            req.session.username = username;
            return res.redirect(303,'/');
        })
        .catch(err => {
            return res.render('error-page', { user: req.user, errorMsg: `${err}`} );
        }) 
        
    }

    // [POST] /login/GGAuth
    ggAuth(req, res){
        const {username} = req.body;

        userModel.findById(username)
        .then((user)=>{
            if (user === null) {
                // user đăng nhập lần đầu => tạo mới user trong database
                return res.status(200).json({
                    code: 1,
                    msg: 'first time login'
                });
            }             
            // đăng nhập thành công
            console.log("đăng nhập bằng google thành công");
            req.session.username = username;
            return res.status(200).json({
                code: 0,
                msg: 'login with google successfully'
            });
        })
        .catch(err => {
            return res.status(500).json({
                msg: err
            });
        })
        
    }

}

module.exports = new LoginController;