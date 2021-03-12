class SiteController{

    // [GET] /
     index(req, res){        
        res.render("home",{displayName: req.user.displayName, avatarUrl: req.user.avatarUrl });
    }

    // [GET] /:userId
    userPage(req, res){
        const userId = req.params.userId;
        console.log("userId = " + userId);
        res.end("trang nha user");
    }

    // [GET] /:userId/posts/:postId
    postDetail(req, res){
        const userId = req.params.userId;
        const postId = req.params.postId;
        console.log("userId = " + userId + " | postId = " + postId);
        res.end("trang post chi tiet cua user");
    }

}

module.exports = new SiteController;