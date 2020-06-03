const express = require('express');
const router = express.Router();
const bookmarkRouter = require('./bookmark');
const bucketListRouter = require('./bucket-list');
const followRouter = require('./follow');
const profileRouter = require('./profile');
const {userController} = require('./userController');
const authMiddleware = require('../../middlewares/auth');
const UserManager = require('../../models/User/UserManager');

router.use(authMiddleware)

router.use('/bookmark',bookmarkRouter);
router.use('/bucket-list',bucketListRouter);
router.use('/follow',followRouter);
router.use('/profile',profileRouter);
router.get('/', userController.getUserInfo);
router.get('/ual', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var responseData = await UserManager.sendAllUserDetailInfo();

    return res.send(responseData);
});
module.exports = router;