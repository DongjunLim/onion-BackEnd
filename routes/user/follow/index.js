const express = require('express');
const router = express.Router();
const { followController } = require('./followController');
const UserManager = require('../../../models/User/UserManager');

//API28
//사용자의 팔로워 목록 요청을 처리하는 라우팅 경로
router.get('/follwer', followController.getFollowerList);

//API29
//사용자가 팔로우한 유저 목록 요청을 처리하는 라우팅 경로
router.get('/follow', followController.getFollowUserList);

//API30
//팔로우 추가 요청을 처리하는 라우팅 경로
router.post('/', followController.addFollowUser);

//API31
//팔로우 삭제 요청을 처리하는 라우팅 경로
router.delete('/', followController.removeFollowUser);

router.get('/', async (req,res) => {
    let { targetNickname } = req.query;

    await UserManager.isFollow(req.userNickname, async (result) =>{
        console.log(result);
        if(result){
            return await result.includes(targetNickname) ? res.sendStatus(200) : res.sendStatus(202);
        } else{
            return res.sendStatus(202)
        }
    });
})

module.exports = router;