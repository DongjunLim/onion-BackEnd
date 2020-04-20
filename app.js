const express = require('express');
const mongoos = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {secret, PORT} = require('./config');
const app = express();

const accountRouter = require('./routes/account');
const feedRouter = require('./routes/feed');
const historyRouter = require('./routes/history');
const homeRouter = require('./routes/home');
const uploadRouter = require('./routes/upload');
const timelineRouter = require('./routes/timeline');
const profileRouter = require('./routes/profile');
const loginRouter = require('./routes/login');
const myprofileRouter = require('./routes/myprofile');



app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/account',accountRouter);
// app.use('/home',homeRouter);
// app.use('/timeline',timelineRouter);
// app.use('/upload',uploadRouter);
// app.use('/history',historyRouter);
// app.use('/profile',profileRouter);
// app.use('/myprofle',myprofileRouter);
// app.use('/feed',feedRouter);
// app.use('/login',loginRouter);


app.set('jwt-secret',secret);

mongoos.promise = global.Promise;

mongoos.connect('mongodb://root:1234@127.0.0.1/onion_BackEnd?authSource=admin').then(() => console.log('Successfully connected to mongodb')).catch(e => console.error(e));





app.listen(PORT, () => {
    
    console.log(`Server is running on ${PORT}`);
})