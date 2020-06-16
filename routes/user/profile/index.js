const express = require('express');
const router = express.Router();
const { profileController } = require('.//profileController');
const multer = require('multer');
const upload = multer({ dest: 'profilePhoto/', limits: { fileSize: 10 * 1024 * 1024 } });
const authMiddleware = require('../../../middlewares/auth')
router.use('/', authMiddleware);
//API25
//사용자의 프로필 정보 요청을 처리하는 라우팅 경로
router.get('/', profileController.getProfileInfo);

//API26
//사용자의 프로필 정보 수정 요청을 처리하는 라우팅 경로 
router.put('/', profileController.updateProfileInfo);

//API27
//마이프로필 정보 요청을 처리하는 라우팅 경로
router.get('/my-profile', profileController.getMyProfileInfo);

router.post('/photo',upload.single('file'), (req,res) => {
    console.log(req.file.filename);
} )

module.exports = router;