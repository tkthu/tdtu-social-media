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
        select : function( selected, options){
            return options.fn(this).replace(
                new RegExp(' value=\"' + selected + '\"'),
                '$& selected="selected"');
        },
        pagination: function(current, pages, otherQuery, block) {
            // console.log("helper this",this)//this là cái javascript object mà mình gửi qua render. VD:  res.render('admin-acc-phong-khoa'...
            // console.log("helper block",block)//block là mấy dòng hbs ở giữa pagination . VD: <li class="page-item">{{{this.aTagHTML}}}</li>      

            var accum = '';
            var i = (Number(current) > 3 ? Number(current) - 2 : 1);
            if( current != 1 ){// trang hiện tại không phải là trang đầu => hiện nút first
                accum += block.fn({
                    aTagHTML : 
                        `<a class="page-link" href="?page=${1}&${otherQuery}" aria-label="First">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only"></span>
                        </a>`,
                });
            }
            if(i !== 1) {
                accum += block.fn({
                    aTagHTML : `<a class="page-link" href="#">...</a>`,
                });
            }
            for(i; i <= (Number(current) + 2) && i <= pages; i++){
                if(i == current){ // nút này là trang hiện tại => tô máu xanh nó
                    accum += block.fn({
                        aTagHTML : `<a class="page-link current-page-link active btn-primary" href="?page=${i}&${otherQuery}">${i}</a>`,
                    });
                } else { // các nút còn lại => ko tô màu
                    accum += block.fn({
                        aTagHTML : `<a class="page-link" href="?page=${i}&${otherQuery}">${i}</a>`,
                    });
                }
                if(i == Number(current) + 2 && i <pages) {
                    accum += block.fn({
                        aTagHTML : `<a class="page-link" href="#">...</a>`,
                    });
                }            
            }
            if( current != pages ){// trang hiện tại không phải là trang cuối => hiện nút last
                accum += block.fn({
                    aTagHTML : 
                        `<a class="page-link" href="?page=${pages}&${otherQuery}" aria-label="Last">
                            <span aria-hidden="true">&raquo;</span>
                            <span class="sr-only"></span>
                        </a>`,
                });
            }

            return accum;            
        },
        getFileName: function(value, options) {
            return value.split('\\').pop().split('/').pop();
        },
        fromNow: function(value, options) {
            if (dayjs(value).isBefore(dayjs(new Date().toISOString()),"day")){
                return dayjs(value).format('DD/MM/YYYY HH:mm');
            }
            return dayjs(value).fromNow();
        },
        cutDown: function(post, options) {
            if(post !== undefined && post.content !== undefined){
                var content = post.content;
                const minlen = 200;
                if (content.length > minlen){
                  content =  $(`<p>${content}</p>`).text().substring(0,minlen) + ` <a href="/${post.sender.id}/posts/${post._id}">...xem thêm</a>` ;
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