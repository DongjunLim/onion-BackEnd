const express = require('express');
const router = express.Router();
const { historyController } = require('./historyController');
const authMiddleware = require('../../middlewares/auth')

router.use('/', authMiddleware);

//API21
//사용자 히스토리 정보를 요청하는 라우팅 경로
router.get('/list', historyController.getHistoryList);

module.exports = router;