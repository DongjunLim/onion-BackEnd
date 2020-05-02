# Onion

### 개인화서비스를 재공하는 패션 SNS

한국산업기술대학교 컴퓨터 공학부 졸업작품

:man: ​Professor : 배유석

:boy: Student : 임동준, 정동진

***

## 1. 개요

* 딥러닝을 통한 이미지 태깅과 UBCF(user based collaborative filtering)를 활용해 사용자 맞춤 패션 서비스 제공
* IBCF(**Item**-**based** collaborative filtering)을 활용한 연관 피드 추천 서비스 제공

***

## 2. 기능

* CRUD SNS
* 딥러닝을 활용한 사용자 맞춤형 추천
* 사진 유사도 분석을 통한 연관 피드 추천

***

## 3. 개발환경

* :iphone: iOS 앱 클라이언트

  > 운영체제: iOS13
  >
  > 개발언어: swift
  >
  > 사용 프레임워크: CocoaPods, Alamofire, UIKIT, AVFoundation

  

* :computer: API Server

  > 운영체제: ubuntu16.04
  >
  > 개발언어: node.js
  >
  > 사용 프레임워크: express.js
  >
  > 사용 미들웨어: bcrypt, body-parser, jwt-webtoken, mongoose, morgan

  

* :floppy_disk: Database​ Server

  > 운영환경: AWS EC2
  >
  > 데이터베이스: MongoDB

  

* :star2: Classifier module​

  > 개발언어: python3.7
  >
  > 사용 프레임워크: tensorflow, keras, sklearn, yolov3
  >
  > 데이터 셋: deepfashion dataset 26만장
  >
  > 신경망 학습 컨테이너: google cloud platform VM

***

## 4. 핵심기능 구현결과

* Image Tagging
  * 서버에 업로드 되는 사진은 다음의 분류 절차를 거친다.
  > 1. yolov3 object detection을 통한 input data preprocessing<br><br>
  <img width="587" alt="스크린샷 2020-05-02 오후 9 30 33" src="https://user-images.githubusercontent.com/40556417/80864213-350ce800-8cbc-11ea-8dfd-71f79cfb1830.png"><br><br>

  > 2. object detection을 통해 크롭한 사진을 분류기에 넣어 카테고리 추출<br><br>
  <img src="https://user-images.githubusercontent.com/40556417/80864294-b5334d80-8cbc-11ea-86b4-6ae9482ec269.png" width="80%"><br><br>
  > 3. 카테고리 추출을 완료하면 이미지 색상분석 후 database에 각각의 정보 저장<br><br>
   <img src="https://user-images.githubusercontent.com/40556417/80864353-080d0500-8cbd-11ea-861e-53b8b90d2036.png" width="80%"><br><br>
   
***
 

* 개인화 서비스
  * 사용자의 컨텐츠 이용 로그기록을 통해 사용자 맞춤 홈화면을 제공한다.<br><br>
  > 1. 사용자 A의 앱 홈 화면<br><br>
  <img src="https://user-images.githubusercontent.com/40556417/80864420-72be4080-8cbd-11ea-864f-4f9e363b16b9.PNG" width="40%"><br><br><br>
  > 2. 사용자 B의 앱 홈 화면<br><br>
  <img src="https://user-images.githubusercontent.com/40556417/80864421-78b42180-8cbd-11ea-9344-84f998f63243.PNG" width="40%"><br><br><br><br>

***

* 연관피드 추천
  * 클릭한 게시글과 유사한 사진들을 연관 게시글로 추천해준다.<br><br><br><br>
  <img src="https://user-images.githubusercontent.com/40556417/80864556-68e90d00-8cbe-11ea-8f25-4d2cacf76602.PNG" width="40%">
  <br><br><br><br>
  <img src="https://user-images.githubusercontent.com/40556417/80864558-6b4b6700-8cbe-11ea-9e90-b5e9b7eb92fe.PNG" width="40%">

***
