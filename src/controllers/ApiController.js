const postModel = require('../models/post.model');
const mogoose = require('mongoose')

class ApiController{

    // [POST] /post
    addPost(req, res){
        var imagesArray = undefined;
        var attachmentsArray = undefined;
        if(req.files.fileImg !== undefined){
            imagesArray = req.files.fileImg.map( fi => {
                return fi.path.replace("public","");
            })
        }
        if(req.files.file !== undefined){
            attachmentsArray = req.files.file.map( fi => {
                return fi.path.replace("public","");
            })
        }        

        const post = {
            _id: mogoose.Types.ObjectId(),
            name: req.body.title,
            createdAt: new Date().toISOString(),
            content: req.body.content,
            department: {
                id: req.body.chuyenmuc,
                name: req.body.tenchuyenmuc,
            },
            sender: {
                id: req.user.username,
                displayName: req.user.displayName,
                avatarUrl: req.user.avatarUrl,
            },
            imagesArray,
            attachmentsArray,
        }

        new postModel(post).save()
        .then(resp => {
            return res.status(200).json({
                code:0,
                msg:'đăng post thành công',
                data: {
                    post,
                    user: req.user,
                }
            });
        })
        .catch(err => {
            return res.status(500).json({
                msg:'đăng post thất bại với lỗi ' + err,
            });
        })
        
    }

    // [DELETE] /post/:postId
    delPost(req, res){   
        //TODO: kiểm tra user này có quyền xóa post này ko
        //TODO: xóa luôn attachment

        var post = {};
        return res.status(200).json({
            code:0,
            msg:'xóa post thành công',
            data: post
        });

    }

    // [POST] /post/:postId/comment
    addComment(req, res){
        var post = {};
        return res.status(200).json({
            code:0,
            msg:'đăng comment thành công',
            data: post
        });
    }

    // [DELETE] /post/:postId/comment/:commentId
    delComment(req, res){   
        //TODO: kiểm tra user này có quyền xóa comment này ko ( 401 Unauthorized)

        var post = {};
        return res.status(200).json({
            code:0,
            msg:'xóa comment thành công',
            data: post
        });

    }

}

module.exports = new ApiController;