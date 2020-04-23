const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {secret, PORT} = require('./config');
const app = express();

const mongoose = require('mongoose');
const dbAccount = require("./mongoAccount.json");
const router = require('./routes');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', router);

app.set('jwt-secret',secret);
//for DataBase
let db = mongoose.connection;
const DB_options = {
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500 , // Reconnect every 500ms
    poolSize: 10 , // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
}

mongoose.promise = global.Promise;

mongoose.connect(
    "mongodb://"+ dbAccount.mongooseID +":" + dbAccount.mongoosePW + "@127.0.0.1/onion_BackEnd?authSource=admin"
    , DB_options ).then(
    () => { console.log('Successfully connected to mongodb'); } ,
    err => { console.error.bind(console,'Check DB - Connection error : '); }
)
//


app.listen(PORT, () => {
    
    console.log(`Server is running on ${PORT}`);
})