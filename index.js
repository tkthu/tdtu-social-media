const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const credentials = require('./credentials');
const route = require('./routes/index');

const db = require('./config/db/index');
db.connect();

const app = express();
app.engine('.hbs', exphbs({extname: ".hbs"}));
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname , 'public')));
app.use(express.json());
app.use(express.urlencoded());

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require("express-session")({ saveUninitialized: false, resave:true, secret: credentials.sessionSecret }));


route(app);


app.listen(credentials.port,()=>{console.log(`http://localhost:${credentials.port}`)})