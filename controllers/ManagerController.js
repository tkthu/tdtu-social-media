class ManagerController{

    // [GET] /staffs
    staffsPage(req, res){        
        res.end("trang quan ly tai khoan nhan vien (tai khoan van phong khoa)");
    }

    // [GET] /students
    studentsPage(req, res){        
        res.end("trang quan ly tai khoan sinh vien");
    }

}

module.exports = new ManagerController;