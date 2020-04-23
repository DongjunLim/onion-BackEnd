const express = require('express');
const router = express.Router();
const fs = require('fs');
const feedManager = require('../../models/Feed/FeedManager');

router.post('/', async (req, res) => {
	var userNickname = 'tester1';
	var uploadedPhoto = fs.createReadStream('routes/forMethodTest/lena.png');
	var feedContent = 'it\'s for test';
	var productTag = {'productId' : 41, 'position':(3, 4)};
	var hashTag = ['this', 'is', 'test'];
	var category = 'shirt';
	var height = 3.12;
	var gender = 'M';
	var age = 20;
    
	console.log(feedManager.createFeed(userNickname, uploadedPhoto, feedContent, productTag, hashTag, category, height, gender, age));
	console.log('Done')
})

module.exports = router;