class LoginController{

    // [GET] /login
    index(req, res){
        res.render('login');
    }

}

module.exports = new LoginController;