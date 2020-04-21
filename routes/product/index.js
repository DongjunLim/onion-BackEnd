const express = require('express');
const router = express.Router();
const { productController } = require('./productController');

//상품정보요청 라우팅 경로
router.get('/', productController.getProduct);

//상품 결제 요청을 처리하는 라우팅 경로
router.post('/payment', productController.buyProduct);

//브랜드의 상품리스트 목록 요청을 처리하는 라우팅 경로, 피드 업로드 때 사용
router.get('/list', productController.getProductList);