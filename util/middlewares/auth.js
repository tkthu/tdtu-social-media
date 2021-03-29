const userModel = require('../../src/models/user.model');

const checkAuth = async (req,res,next) => {
    //TODO: Chuyển thành token...

    //nếu chưa đăng nhập thì chuyển qua trang login
    if (!req.session.username){
        return res.redirect(303,'/login');
    }
    const username = req.session.username;
    await userModel.findOne({username})
    .then((user)=>{
        req.user = {
            username : user.username,
            displayName :  user.displayName,
            avatarUrl :  user.avatarUrl,
            userType: user.userType,
            staffInfo: user.staffInfo,
            studentInfo: user.studentInfo,
        };
        console.log("req.user: " ,req.user, '\n');
    })
    .catch(err => {
        console.log('Error ', err)
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