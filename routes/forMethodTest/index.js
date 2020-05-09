const express = require('express');
const router = express.Router();
const fs = require('fs');
const feedManager = require('../../models/Feed/FeedManager');
const userManager = require('../../models/User/UserManager');
const profileManager = require('../../models/Profile/ProfileManager');
const productManager = require('../../models/Product/ProductManager');



router.post('/', async (req, res) => {
	//await userManager.follow(userNickname, followedUserNickname)

	await feedManager.getPersonalRelatedList('Red');
	res.statusCode = 201
	res.send()
});

module.exports = router;

// <UserManager>
/* createUser 메소드
	var userEmail = 'test0501@naver.com';
	var userNickname = 'test0501';
	var userPassword = 'test0501pw';
	var userGender = 'M';
	var userAge = 30;
	var userHeight = 177.4;
	var userAddress1 = 'Seoul';
	var userAddress2 = 'Gangnam';
	var userInstagramIUrl ='inst.gram/abc'
	var secret = 'none';

	await userManager.createUser(userEmail, userNickname, userPassword, userGender, userAge, userHeight, 
		userAddress1, userAddress2, userInstagramUrl ,secret);
*/
/* deleteUser 메소드
	var userNickname = 'test0501';
	var result = await userManager.deleteUser(userNickname);
*/
/* getFollowUser, getFollowerUser 메소드
	var result = await userManager.getFollowUserList('test0510');
	console.log(result);
*/
/*uploadProfilePhoto 메소드
	var userNickname = 'addresTest'

	await userManager.uploadProfilePhoto(userNickname, 'test.jpg');
*/
/* follow 메소드
	var userNickname = 'addresTest';
	var followedUserNickname = 'timcook';
	var result = await userManager.follow(userNickname, followedUserNickname);
*/
/* unFollow 메소드
	var userNickname = 'addresTest';
	var followedUserNickname = 'timcook';
	var result = await userManager.unFollow(userNickname, followedUserNickname);
	await console.log(result);
*/

// <FeedManager>
/*	createFeed 메소드
	var userNickname = 'tester1';
	var uploadedPhoto = fs.createReadStream('routes/forMethodTest/lena.png');
	var feedContent = 'it\'s for test';
	var productTag = {'productId' : 41, 'position':(3, 4)};
	var hashTag = ['this', 'is', 'test'];
	var category = 'shirt';
	var height = 3.12;
	var gender = 'M';
	var age = 20;
    
	await feedManager.createFeed(userNickname, uploadedPhoto, feedContent, productTag, hashTag, category, height, gender, age)
	console.log('Done')
*/
/* createReply 메소드
	var userNickname = 'tester2';
    var feedId = '5ea1873608782611acfb88c8';
    var replyContent ='really';

	await feedManager.createReply(userNickname, feedId, replyContent)
	console.log('Done')
*/
/* getFeed 메소드
    var feedId = '5ea1873608782611acfb88c8';

	var feedData = await feedManager.getFeed(feedId);
	console.log(feedData)
*/
/* getReplyList 메소드
    var feedId = '5ea1873608782611acfb88c8';

	var feedData = await feedManager.getReplyList(feedId);
	console.log(JSON.stringify(feedData, null, 4))
*/
/* getProductTagList 메소드
    var feedId = '5ea1873608782611acfb88c8';

	var feedData = await feedManager.getProductTagList(feedId);
	console.log(JSON.stringify(feedData, null, 4));
*/
/* getUserFeedList 메소드
    var userNickname = 'tester1';

	var feedData = await feedManager.getUserFeedList(userNickname);
	console.log(JSON.stringify(feedData, null, 4));
*/
/* updateFeed 메소드
    var feedId = '5ea1873608782611acfb88c8';

	await feedManager.updateFeed(feedId, "update feed22222");
	console.log('Done');
*/
/* removeFeed 메소드
	var feedId ='5ea190f97fb9910df8cb094b';

	await feedManager.removeFeed(feedId);
	console.log('Done');
*/