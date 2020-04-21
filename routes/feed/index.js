const express = require('express');
const router = express.Router();
const { feedController } = require('./feedController');

//API4
//피드 업로드 요청
//피드 업로드 요청을 처리하는 라우팅 경로
router.post('/', feedController.createFeed);

//API5
//피드 수정 요청
//피드 본문 수정 요청을 처리하는 라우팅 경로
router.put('/', feedController.updateFeed);

//API6
//피드 좋아요 요청
//사용자가 피드에 좋아요를 눌렀을때 요청을 처리하는 라우팅 경로
router.put('/like', feedController.like);

//API7
//피드 좋아요 해제 요청
//사용자가 피드의 좋아요를 해제할때 요청을 처리하는 라우팅 경로
router.put('/cancel-like', feedController.cancelLike);

//API8
//피드 댓글 정보 요청
//피드에 달린 댓글 목록 요청을 처리하는 라우팅 경로
router.get('/reply', feedController.getReplyList);

//API9
//피드 댓글 등록 요청
//피드에 댓글을 등록하는 요청을 처리하는 라우팅 경로
router.post('/reply', feedController.createReply);

//API10
//피드 댓글 삭제 요청
//피드에 댓글을 삭제하는 요청을 처리하는 라우팅 경로
router.delete('/reply', feedController.deleteReply);

//API11
//피드 상품태그 정보 요청
//피드에 태그된 상품태그에 대한 정보 요청을 처리하는 라우팅 경로
router.get('/product-tag', feedController.getProductTagList);