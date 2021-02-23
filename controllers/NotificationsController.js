class NotificationsController{

    // [GET] /
    index(req, res){        
        res.end("trang tất cả thông báo");
    }

    // [GET] /departments
    departmentPage(req, res){        
        res.end("trang phòng ban");
    }

}

module.exports = new NotificationsController;