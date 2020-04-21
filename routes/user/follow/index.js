const express = require('express');
const router = express.Router();
const { followController } = require('./followController');

//사용자의 팔로워 목록 요청을 처리하는 라우팅 경로
router.get('/follwer', followController.getFollowerList);

//사용자가 팔로우한 유저 목록 요청을 처리하는 라우팅 경로
router.get('/follow', followController.getFollowUserList);

//팔로우 추가 요청을 처리하는 라우팅 경로
router.post('/', followController.addFollowUser);

//팔로우 삭제 요청을 처리하는 라우팅 경로
router.delete('/', followController.removeFollowUser);