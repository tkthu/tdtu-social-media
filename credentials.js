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
    url:{
        dev: 'http://localhost:8080',
        pro: 'https://tdtu-social-media.herokuapp.com'
    },
    OAuthKey:{
        dev: '166513767436-l8pgm3hatt7ev99qvechpj63mgu2cttd.apps.googleusercontent.com',
        pro: '166513767436-etdj05bvej11g79bsf7o1tppfrmhvniu.apps.googleusercontent.com'
    }

}