const mongoose = require('mongoose')
var credentials = require('../../../credentials')

async function connect() {
    try {
        await mongoose.connect(credentials.mongo.dev.conn, {
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