module.exports = {
    cookieSecret: 'ck987$$',
    sessionSecret: 'ss123$$',
    mongo:{
        dev:{
            conn: 'mongodb://localhost:27017/social-media-dev'
        },
        pro:{
            conn: ''
        }

    },
    port:8080,
    url:{
        dev: 'http://localhost:8080',
        pro: ''
    },

}