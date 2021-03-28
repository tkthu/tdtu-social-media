const exphbs = require('express-handlebars');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const hbs = exphbs.create({
    extname: ".hbs",
    partialsDir: [
        'src/views/partials',
        'src/views/partials/popup',
        'src/views/partials/share-with-client',
    ],
    layoutsDir: 'src/views/layouts',
    defaultLayout:'main',
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
            if(post !== undefined){
                var content = post.content;
                const minlen = 200;
                if (content.length > minlen){
                    content = content.substring(0,minlen) + `...  <a href="/${post.sender.id}/posts/${post._id}">xem thêm</a>`;
                }
                return content;
            }
            return "";
            
        },
    }
});

function setupViewEngine(app){    
    app.engine(".hbs", hbs.engine);    
    app.set('view engine', '.hbs');
    app.set('views', 'src/views');
}

module.exports = {setupViewEngine, hbs};