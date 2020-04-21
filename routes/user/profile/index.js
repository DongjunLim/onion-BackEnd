const express = require('express');
const router = express.Router();
const { profileController } = require('.//profileController');

//API25
//사용자의 프로필 정보 요청을 처리하는 라우팅 경로
router.get('/', profileController.getProfileInfo);

//API26
//사용자의 프로필 정보 수정 요청을 처리하는 라우팅 경로 
router.put('/', profileController.updateProfileInfo);

//API27
//마이프로필 정보 요청을 처리하는 라우팅 경로
router.get('/my-profile', profileController.getMyProfileInfo);