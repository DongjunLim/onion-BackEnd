const express = require('express');
const router = express.Router();
const { thumbnailController } = require('./thumbnailController');

//홈화면 요청처리
//사용자 맞춤 피드 썸네일 리스트 요청을 처리하는 라우팅 경로
router.get('/personal', thumbnailController.getPersonalThumbnail)

//타임라인화면 요청처리
//사용자가 팔로우한 유저들의 피드 썸네일 리스트 요청을 처리하는 라우팅 경로
router.get('/follower',thumbnailController.getTimelineThumbnail)

//프로필화면 요청처리
//입력으로 들어오는 사용자의 피드 썸네일 리스트 요청을 처리하는 라우팅 경로
router.get('/user',thumbnailController.getProfileThumbnail)

//상세게시물화면 연관 피드 썸네일 요청 처리
//상세게시물과 연관된 피드 썸네일 리스트 요청을 처리하는 라우팅 경로
router.get('/relative',thumbnailController.getRelativeThumbnail)