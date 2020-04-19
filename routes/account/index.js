const express = require('express');
const router = express.Router();
const { accountController} = require('./accountController');


router.get('/check-email', accountController.checkEmail);

router.get('/check-nickname', accountController.checkNickname);

router.get('/register', accountController.register);

module.exports = router;