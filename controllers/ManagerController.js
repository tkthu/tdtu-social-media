class ManagerController{

    // [GET] /staffs
    staffsPage(req, res){        
        res.render("admin-acc-phong-khoa",{user: req.user});
    }

    // [GET] /students
    studentsPage(req, res){        
        res.render("admin-acc-student",{user: req.user});
    }

}

module.exports = new ManagerController;