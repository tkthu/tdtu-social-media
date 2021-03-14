const loginRouter = require('./login');
const registerRouter = require('./register');
const siteRouter = require('./site');
const notifRouter = require('./notifications');
const managerRouter = require('./manager');

const {checkAuth,checkAdmin} = require('../middlewares/auth')

function route(app){
    app.use('/logout',(req,res,next) =>{
        req.session.destroy();
        console.log('Đã logout')
        res.redirect('/login');
    });     
    app.use('/login',loginRouter);
    app.use('/register',registerRouter);
    app.use('/notifications', checkAuth, notifRouter);
    app.use('/manager', checkAuth, checkAdmin, managerRouter);// chỉ cho admin xem trang này
    app.use('/', checkAuth, siteRouter);
}

module.exports = route