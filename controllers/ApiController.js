class ApiController{

    // [POST] /post
    addPost(req, res){
        var post = {};
        console.log(req.body)
        return res.status(200).json({
            code:0,
            msg:'đăng post thành công',
            data: post
        });
    }

    // [DELETE] /post/:postId
    delPost(req, res){   
        //TODO: kiểm tra user này có quyền xóa post này ko

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