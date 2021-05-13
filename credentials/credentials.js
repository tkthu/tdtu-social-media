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
    },
    firebaseConfig: {
        apiKey: "AIzaSyAmdBbiGojAmgJtJv-1xwBZbHjHMx-6MIw",
        authDomain: "tdtu-social-media.firebaseapp.com",
        projectId: "tdtu-social-media",
        storageBucket: "tdtu-social-media.appspot.com",
        messagingSenderId: "275163348144",
        appId: "1:275163348144:web:959fd26f6dd5b185984f75",
        measurementId: "G-3H2Y5GBHX3"
    }

}