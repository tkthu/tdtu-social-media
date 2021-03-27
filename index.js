const express = require('express');
const path = require('path');
const credentials = require('./credentials');
const route = require('./routes/index');

const db = require('./util/config/db');
db.connect();

const app = express();

const {setupViewEngine} = require('./util/config/hbs');
setupViewEngine(app);

app.use(express.static(path.join(__dirname , 'public')));
app.use(express.json());
app.use(express.urlencoded());

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({ saveUninitialized: false, resave:true, secret: credentials.sessionSecret }));
app.use(require('express-flash')());


route(app);


app.listen(credentials.port,()=>{console.log(`http://localhost:${credentials.port}`)})