const express = require('express');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const {secret, PORT} = require('./config');
const app = express();


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('jwt-secret',secret);

app.listen(PORT, () => {
    
    console.log(`Server is running on ${PORT}`);
})