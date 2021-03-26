const userModel = require('../models/user.model');

const checkAuth = async (req,res,next) => {
    //nếu chưa đăng nhập thì chuyển qua trang login
    if (!req.session.username){
        return res.redirect(303,'/login');
    }
    const username = req.session.username;
    await userModel.findOne({username}, (err,user)=>{
        req.user = {
            username : user.username,
            displayName :  user.displayName,
            avatarUrl :  user.avatarUrl,
            userType: user.userType,
        };
        console.log("req.user: " ,req.user, '\n');
    })
    next();
}

const checkAdmin = (req,res,next) => {
    //nếu người dùng là admin
    if (req.user.userType !== 'admin'){
        return res.end("Only admin can see this page");
    }
    next();
}

module.exports = {checkAuth, checkAdmin}