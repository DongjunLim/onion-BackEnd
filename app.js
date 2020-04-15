const express = require('express');


const bodyParser = require('body-parser');
const morgan = require('morgan')
const PORT = 3000;

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(PORT, () => {
    
    console.log(`Server is running on ${PORT}`);
})