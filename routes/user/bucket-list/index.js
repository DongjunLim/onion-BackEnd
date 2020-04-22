const express = require('express');
const router = express.Router();
const { bucketListController } = require('./bucketListController');

//API32
//사용자가 장바구니에 추가한 상품정보 요청을 처리하는 라우팅 경로
router.get('/', bucketListController.getBucketList);

//API33
//사용자가 상품을 장바구니에 추가하는 요청을 처리하는 라우팅 경로
router.post('/', bucketListController.addBucketList);

//API34
//사용자가 장바구니에서 상품을 삭제하는 요청을 처리하는 라우팅 경로
router.delete('/', bucketListController.removeBucketList);

module.exports = router;