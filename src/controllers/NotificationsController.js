class NotificationsController{

    // [GET] /
    index(req, res){      
        res.render("all-notification",{user: req.user});
    }

    // [GET] /departments
    departmentPage(req, res){        
        res.render("phongban",{user: req.user});
    }

}

module.exports = new NotificationsController;