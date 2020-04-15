const express = require('express');
const um = require('../models/UserManager');
const router = express.Router();

router.get('/', async (req, res) => {

    const params = [req.query.name, req.query.id];
    

    console.log(params);
    res.send("Hello World!");
})







module.exports = router;