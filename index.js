const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const credentials = require('./credentials');
const route = require('./routes/index');

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime)

const db = require('./config/db/index');
db.connect();

const app = express();
app.engine('.hbs', exphbs({
    extname: ".hbs",
    helpers: {
        inc: function(value, options){return parseInt(value) + 1;},
        ifEquals: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        getFileName: function(value, options) {
            return value.split('\\').pop().split('/').pop();
        },
        fromNow: function(value, options) {
            return dayjs(value).fromNow();
        },
        cutDown: function(post, options) {
            var content = post.content;
            const minlen = 200;
            if (content.length > minlen){
                content = content.substring(0,minlen) + `...  <a href="/${post.sender.id}/posts/${post._id}">xem thêm</a>`;
            }
            return content;
        },
    }
}));
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname , 'public')));
app.use(express.json());
app.use(express.urlencoded());

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({ saveUninitialized: false, resave:true, secret: credentials.sessionSecret }));
app.use(require('express-flash')());


route(app);


app.listen(credentials.port,()=>{console.log(`http://localhost:${credentials.port}`)})