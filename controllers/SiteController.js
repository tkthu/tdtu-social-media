class SiteController{

    // [GET] /
    index(req, res){
        res.render("home",{user: req.user});
    }

    // [GET] /:userId
    userPage(req, res){
        const userId = req.params.userId;
        console.log("userId = " + userId);
        res.render("personal",{user: req.user});
    }

    // [GET] /:userId/posts/:postId
    postDetail(req, res){
        const userId = req.params.userId;
        const postId = req.params.postId;
        console.log("userId = " + userId + " | postId = " + postId);
        res.render("detail-notification",{user: req.user});
    }

}

module.exports = new SiteController;