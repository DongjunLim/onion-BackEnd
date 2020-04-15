const express = require('express');
const { registerController } = require('./registerController');
const router = express.Router();

registerController.checkEmail();


router.get('/register', registerController.checkEmail);
router.get()



module.exports = router;