const loginRouter = require('./login');
const siteRouter = require('./site');
const notifRouter = require('./notifications');
const managerRouter = require('./manager');

function route(app){
    // TODO: phải đăng nhập mới vào /, /notifications, /manager
    // //nếu chưa đăng nhập thì chuyển qua trang login
    // if (!req.session.username){
    //     return res.redirect(303,'/login');
    // }
    app.use('/', siteRouter);    
    app.get('/login',loginRouter);
    // app.use('/notifications',notifRouter);
    // app.use('/manager',managerRouter);
}

module.exports = route