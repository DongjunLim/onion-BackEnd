const express = require('express');
const router = express.Router();
const fs = require('fs');
const feedManager = require('../../models/Feed/FeedManager');

router.post('/', async (req, res) => {
	var feedId ='5ea190f97fb9910df8cb094b';

	await feedManager.removeFeed(feedId);
	console.log('Done');
})

module.exports = router;

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