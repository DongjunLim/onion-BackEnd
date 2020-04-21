const express = require('express');
const router = express.Router();
const { bookmarkController } = require('./bookmarkController');

//사용자가 추가한 북마크 썸네일 정보 요청을 처리하는 라우팅 경로
router.get('/', bookmarkController.getBookmarkFeedList);

//북마크 등록 요청을 처리하는 라우팅 경로
router.post('/', bookmarkController.addBookmark);

//북마크 삭제 요청을 처리하는 라우팅 경로
router.delete('/', bookmarkController.removeBookmark);