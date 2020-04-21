const express = require('express');
const router = express.Router();
const { accountController} = require('./accountController');


//회원가입할때 이메일 중복확인 요청을 처리하는 라우팅 경로
router.get('/check-email', accountController.checkEmail);

//회원가입할때 닉네임 중복확인 요청 처리하는 라우팅 경로
router.get('/check-nickname', accountController.checkNickname);

//회원가입 요청을 처리하고 DB에 회원정보를 등록하는 라우팅 경로
router.get('/register', accountController.register);



module.exports = router;