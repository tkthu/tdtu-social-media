module.exports = {
    cookieSecret: 'ck987$$',
    sessionSecret: 'ss123$$',
    mongo:{
        dev:{
            conn: 'mongodb://localhost:27017/social-media-dev'
        },
        pro:{
            conn: 'mongodb+srv://db_admin:db_123456@cluster0.pvykl.mongodb.net/social-media'
        }

    },
    port:8080,
    url:{
        dev: 'http://localhost:8080',
        pro: ''
    },

}