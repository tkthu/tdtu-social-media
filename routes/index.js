const loginRouter = require('./login');
const registerRouter = require('./register');
const siteRouter = require('./site');
const notifRouter = require('./notifications');
const managerRouter = require('./manager');
const apiRouter = require('./api');

const {checkAuth,checkAdmin} = require('../util/middlewares/auth')
const {exposeTemplates} = require('../util/middlewares/exposeTemplates')

function route(app){
    app.use((req,res,next)=>{
        console.log('-------------------refresh----------------------')
        next()
    })
    app.use('/logout',(req,res,next) =>{
        req.session.destroy();
        console.log('Đã logout')
        res.redirect('/login');
    });
    app.use('/register',registerRouter);
    app.use('/api',checkAuth, apiRouter);// phải đăng nhập mói dùng được api của web

    app.use('/login',loginRouter);    
    app.use('/notifications', checkAuth, notifRouter);
    app.use('/manager', checkAuth, checkAdmin, managerRouter);// chỉ cho admin xem trang này
    app.use('/', checkAuth, exposeTemplates, siteRouter);
}

module.exports = route;