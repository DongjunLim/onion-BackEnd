const express = require('express');
const router = express.Router();
const { loginController } = require('./loginController');

//API16
//토큰이 없거나 만료된 사용자의 로그인 요청을 처리하는 라우팅 경로
router.get('/', loginController.loginVerification);

//API17
//소셜로그인 요청을 처리하는 라우팅 경로
router.get('/social', loginController.socialLoginVerification);

module.exports = router;