const userModel = require('../models/user.model');

class RegisterController{    
    // [POST] /register
    register(req, res){
        const {username, displayName, imageUrl, password, userType, staffInfo, studentInfo} = req.body;

        userModel.findById(username,(err,user) => {
            if (err) return res.status(500).json('database failure');
            if (user !== null) {// user đã có tải khoản
                return res.status(200).json({
                    code:1,
                    msg:'user đã có tải khoản'
                });
            }
            new userModel({
                _id: username,
                username: username,
                password: password,
                displayName: displayName,
                avatarUrl: imageUrl || '/img/no-face.png',
                createdAt: new Date().toISOString(),
                lastEdited: new Date().toISOString(),
                staffInfo: staffInfo,
                studentInfo: studentInfo,
                userType: userType || "staff",
            }).save();
            return res.status(200).json({
                code:0,
                msg:'đăng kí tài khoản cho user thành công'
            });
        });
        
    }
}

module.exports = new RegisterController;