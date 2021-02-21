const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path');
const port = 8080

var credentials = require('./credentials')

const app = express()

app.engine('.hbs', exphbs({extname: ".hbs"}));
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname , 'public')));

app.use(express.json());
app.use(express.urlencoded());
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require("express-session")({ saveUninitialized: false, resave:true, secret: credentials.sessionSecret }));


app.get('/', (req, res) => { 
    //nếu chưa đăng nhập thì chuyển qua trang login
    if (!req.session.username){
        return res.redirect(303,'/login');
    }
    res.render("home")
});

app.get('/login',(req, res) =>{
    res.render('phongban')
})


app.listen(port,()=>{console.log(`http://localhost:${port}`)})