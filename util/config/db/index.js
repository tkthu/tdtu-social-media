const mongoose = require('mongoose')
var credentials = require('../../../credentials/credentials')

async function connect() {
    let db_connection = `mongodb+srv://${'database_admin'}:${'gP7xexfwcpDPsKS'}@cluster0.pl9px.mongodb.net/social-media`
    // if (process.env.DB_ADMIN && process.env.DB_PASSWORD)
    //     db_connection = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASSWORD}@cluster0.pl9px.mongodb.net/social-media`

    try {
        await mongoose.connect(db_connection, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false,
            // useCreateIndex: true,
            // server:{
            //     socketOptions:{keepAlive:1}
            // }
        });
        console.log('Connect to database successfully')
    } catch (error) {
        console.log('Connect to database failure')
    }
}

module.exports = { connect }