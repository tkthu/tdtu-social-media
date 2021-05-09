const express = require('express');
const path = require('path');
const credentials = require('./credentials');
const route = require('./routes/index');

const db = require('./util/config/db');
db.connect();

const app = express();

const {setupViewEngine} = require('./util/config/hbs');
setupViewEngine(app);

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname , 'public')));
app.use(express.json());
app.use(express.urlencoded());

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({ saveUninitialized: false, resave:true, secret: credentials.sessionSecret }));
app.use(require('express-flash')());

io.on('connection', socket => {
    console.log("kết nối socket")

    socket.on('post-success', data => {
        io.emit('post-alert', data)
        // console.log('nhận được post-success từ 1 user ', data)
    })

    socket.on('comment-success', data => {
        io.emit('comment', data)
        // console.log('nhận được comment-success từ 1 user ', data)
    })

    socket.on('delete-post-success', data => {
        io.emit('deleted-post', data)
        // console.log('nhận được kết quả xóa post từ 1 user', data)
    })

    socket.on('delete-comment-success', data => {
        io.emit('deleted-comment', data)
        // console.log('nhận được kết quả xóa post từ 1 user', data)
    })

    socket.on('edit-post-success', data => {
        io.emit('edit-post', data)
        // console.log('nhận được kết quả edit post từ 1 user', data)
    })

    socket.on('edit-comment-success', data => {
        io.emit('edit-comment', data)
        // console.log('nhận được kết quả edit post từ 1 user', data)
    })
    
})

route(app);

const port = process.env.PORT || 8080;
server.listen(port,()=>{console.log(`http://localhost:${port}`)})