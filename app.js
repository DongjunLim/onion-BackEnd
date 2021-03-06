const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {secret, PORT} = require('./config');
const app = express();
const UserManager = require('./models/User/UserManager');
const mongoose = require('mongoose');
const dbAccount = require("./mongoAccount.json");
const router = require('./routes');
const cors = require('cors');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({limit:"50mb", extended: false}));
app.use(bodyParser.json({ limit:"50mb" }));
app.use('/', router);
app.use(cors());

app.set('jwt-secret',secret);
//for DataBase
//let db = mongoose.connection;
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
    "mongodb://"+ dbAccount.mongooseID +":" + dbAccount.mongoosePW + "@" + dbAccount.EC2_link + ":27017/onion_BackEnd?authSource=admin"
    , DB_options ).then(
    () => { console.log('Successfully connected to mongodb'); } ,
    err => { console.error.bind(console,'Check DB - Connection error : '); }
)


console.log(UserManager.getUser("Red"));

app.listen(PORT, () => {
    
    console.log(`Server is running on ${PORT}`);
})