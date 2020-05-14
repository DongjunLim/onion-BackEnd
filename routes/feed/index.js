const express = require('express');
const router = express.Router();
const { feedController } = require('./feedController');
const thumbnailRouter = require('./thumbnail');
const FeedManager = require('../../models/Feed/FeedManager');
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } });
const pythonModule = require('../../pythonCode/Servicer');
const authMiddleware = require('../../middlewares/auth')
const UserManager = require('../../models/User/UserManager');

router.use('/', authMiddleware)

router.use('/thumbnail', thumbnailRouter);

// router.get('/', (req, res) => {

//     const { feedId } = req.query;



//     const element = FeedManager.getFeed(feedId);
//     if (element) {
//         const responseData = {
//             feedId: element['id'],
//             hashTag: element['feed_hashtag'],
//             profileUrl: element['author_profile_photo'],
//             profilePhotoUrl: element['author_profile_photo'],
//             photoUrl: element['feed_photo_url'],
//             feedThumbnailUrl: element['feed_thumbnail_url'],
//             authorNickname: element['feed_user_nickname'],
//             content: element['feed_content'],
//             likeCount: 4,
//             isLike: true,
//             isFollow: true
//         }
//     }

//     return responsData ? res.send(responseData) : res.sendStatus(202)
// });
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

router.post('/file', upload.single('file'), async (req, res) => {
    console.log(req.file);
    console.log(req.body);

    var responseData = await FeedManager.analyzePhoto(req.file.filename);

    return responseData ? res.send(responseData) : res.sendStatus(202);
})

router.get('/test', async (req, res) => {
    Info = {
        feedId: "fhuf3f3",
        hashTag: ["tag1", "tag2", "tag3"],
        profileUrl: "PROFILEURL",
        profilePhotoUrl: "PROFILEPHOTOURL",
        authorNickname: "username",
        content: "Main Content",
        likeCount: 4,
        isLike: false,
        isFollow: true
    }

    const feed = {
        feedList: [
            {
                feedId: "fhuf3f3",
                feedThumbnailUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/photo/1581d0c663e8ed5d6dec564307bc2db41927b7a8",
                photoUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/photo/1581d0c663e8ed5d6dec564307bc2db41927b7a8",
                hashTag: ["tag1", "tag2", "tag3"],
                profileUrl: "PROFILEURL",
                profilePhotoUrl: "PROFILEPHOTOURL",
                authorNickname: "username",
                content: "Main Content2",
                likeCount: 4,
                isLike: false,
                isFollow: true
            },
            {
                feedId: "fhuf3f3",
                feedThumbnailUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/2.jpg",
                photoUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/2.jpg",
                hashTag: ["tag1", "tag2", "tag3"],
                profileUrl: "PROFILEURL",
                profilePhotoUrl: "PROFILEPHOTOURL",
                authorNickname: "username1121",
                content: "Main Content1",
                likeCount: 4,
                isLike: false,
                isFollow: true
            },
            {
                feedId: "fhuf3f3",
                feedThumbnailUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/3.jpg",
                photoUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/3.jpg",
                hashTag: ["tag1", "tag2", "tag3"],
                profileUrl: "PROFILEURL",
                profilePhotoUrl: "PROFILEPHOTOURL",
                authorNickname: "username123123",
                content: "Main Content3",
                likeCount: 4,
                isLike: false,
                isFollow: true
            },
            {
                feedId: "fhuf3f3",
                feedThumbnailUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/4.jpg",
                photoUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/4.jpg",
                hashTag: ["tag1", "tag2", "tag3"],
                profileUrl: "PROFILEURL",
                profilePhotoUrl: "PROFILEPHOTOURL",
                authorNickname: "username23213",
                content: "Main Content4",
                likeCount: 4,
                isLike: false,
                isFollow: true
            },
            {
                feedId: "fhuf3f3",
                feedThumbnailUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/5.jpg",
                photoUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/5.jpg",
                hashTag: ["tag1", "tag2", "tag3"],
                profileUrl: "PROFILEURL",
                profilePhotoUrl: "PROFILEPHOTOURL",
                authorNickname: "username",
                content: "Main Content",
                likeCount: 4,
                isLike: false,
                isFollow: true
            },
            {
                feedId: "fhuf3f3",
                feedThumbnailUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/6.jpg",
                photoUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/6.jpg",
                hashTag: ["tag1", "tag2", "tag3"],
                profileUrl: "PROFILEURL",
                profilePhotoUrl: "PROFILEPHOTOURL",
                authorNickname: "username",
                content: "Main Content",
                likeCount: 4,
                isLike: false,
                isFollow: true
            },
            {
                feedId: "fhuf3f3",
                feedThumbnailUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/7.jpg",
                photoUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/7.jpg",
                hashTag: ["tag1", "tag2", "tag3"],
                profileUrl: "PROFILEURL",
                profilePhotoUrl: "PROFILEPHOTOURL",
                authorNickname: "username",
                content: "Main Content",
                likeCount: 4,
                isLike: false,
                isFollow: true
            },
            {
                feedId: "fhuf3f3",
                feedThumbnailUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/8.jpg",
                photoUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/8.jpg",
                hashTag: ["tag1", "tag2", "tag3"],
                profileUrl: "PROFILEURL",
                profilePhotoUrl: "PROFILEPHOTOURL",
                authorNickname: "username",
                content: "Main Content",
                likeCount: 4,
                isLike: false,
                isFollow: true
            },
            {
                feedId: "fhuf3f3",
                feedThumbnailUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/9.jpg",
                photoUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/9.jpg",
                hashTag: ["tag1", "tag2", "tag3"],
                profileUrl: "PROFILEURL",
                profilePhotoUrl: "PROFILEPHOTOURL",
                authorNickname: "username",
                content: "Main Content",
                likeCount: 4,
                isLike: false,
                isFollow: true
            },
            {
                feedId: "fhuf3f3",
                feedThumbnailUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/10.jpg",
                photoUrl: "https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/thumbnail/10.jpg",
                hashTag: ["tag1", "tag2", "tag3"],
                profileUrl: "PROFILEURL",
                profilePhotoUrl: "PROFILEPHOTOURL",
                authorNickname: "username",
                content: "Main Content",
                likeCount: 4,
                isLike: false,
                isFollow: true
            }
        ]
    }

    res.send(feed);
    return;
})

module.exports = router;