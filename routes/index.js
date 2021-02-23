const loginRouter = require('./login');
const siteRouter = require('./site');
const notifRouter = require('./notifications');
const managerRouter = require('./manager');

function route(app){
    
    app.use((req,res,next)=>{
        console.log(req.url)
        // xóa flash message trong session
        res.locals.msg = req.session.msg || '';
        delete req.session.msg
        next();
    })
    app.use('/login',loginRouter);  
    app.use(checkAuth)
    // app.use('/notifications', notifRouter);
    // app.use('/manager', managerRouter);
    app.use('/', siteRouter);
}

module.exports = route

const checkAuth = (req,res,next) => {
    //nếu chưa đăng nhập thì chuyển qua trang login
    if (!req.session.username){
        // console.log("chua dang nhap cho link " + req.url)
        return res.redirect(303,'/login');
    }
    next()
}