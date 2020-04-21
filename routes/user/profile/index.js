const express = require('express');
const router = express.Router();
const { profileController } = require('.//profileController');
//사용자의 프로필 정보 요청을 처리하는 라우팅 경로
router.get('/', profileController.getProfileInfo);

//사용자의 프로필 정보 수정 요청을 처리하는 라우팅 경로 
router.put('/', profileController.updateProfileInfo);

//마이프로필 정보 요청을 처리하는 라우팅 경로
router.get('/my-profile', profileController.getMyProfileInfo);