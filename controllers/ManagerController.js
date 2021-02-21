class ManagerController{

    // [GET] /staffs
    staffsPage(req, res){        
        res.end("trang quản lý tài khoản nhân viên (tài khoản phòng/khoa)");
    }

    // [GET] /students
    studentsPage(req, res){        
        res.end("trang quản lý tài khoản sinh viên");
    }

}

module.exports = new ManagerController;