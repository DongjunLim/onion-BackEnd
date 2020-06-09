const FEED_HANDLER = require("../../schemas/FEED");
const USER_DETAIL_INFO_HANDLER = require("../../schemas/USER_DETAIL_INFO");
const UserManager = require("../User/UserManager");
const ProductManager = require("../Product/ProductManager");
const AWS = require('aws-sdk');
const s3Account = require("../../s3Account.json");
const crypto = require("crypto");
const mongoose = require("mongoose");
const pythonModule = require('../../pythonCode/Servicer');
const shuffle_array = require('shuffle-array');
//for Test
const request = require('request');
const util = require('util');
const fs = require('fs');
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')
const delay = (duration) =>
  new Promise(resolve => setTimeout(resolve, duration));

class FeedManager{
	static async analyzePhoto(filename){
		const requestPromise = util.promisify(request.post);

		var check1 = await pythonModule.resizeImage(filename);
		var check2 = await pythonModule.getCroppedPeople(filename);
		var check3 = await pythonModule.backgroundRemoval(filename);

		if (check1 && check2 && check3){
			var DominantColor = await requestPromise({
				url: 'http://127.0.0.1:5000/getDominantColor',
				body: {'filename': filename},
				json: true
			})
			DominantColor = DominantColor.body;

			await delay(1000);
			
			var fashionClass = await requestPromise({
				url: 'http://127.0.0.1:5000/classify',
				body: {'filename': filename},
				json: true
			})
			fashionClass = fashionClass.body;

			return {'fileName': filename, 'dominantColor': DominantColor, 'fashionClass': fashionClass};
		} else {
			return false;
		}
	}

	static async analyzePhotoForDemo(filename,callback){
		const requestPromise = util.promisify(request.post);

		var check1 = await pythonModule.resizeImage(filename);
		var check2 = await pythonModule.getCroppedPeople(filename);
		var check3 = await pythonModule.backgroundRemoval(filename);

		if (check1 && check2){
			var DominantColor = await requestPromise({
				url: 'http://127.0.0.1:5000/getDominantColor',
				body: {'filename': filename, 'isDemo': true},
				json: true
			})
			DominantColor = DominantColor.body;

			await delay(1000);

			var fashionClass = await requestPromise({
				url: 'http://127.0.0.1:5000/classify',
				body: {'filename': filename, 'isDemo': true},
				json: true
			})
			fashionClass = fashionClass.body;

			var croppedDataUrl = 'cropped/' + filename + '.png';
			var backgroundRemovalDatalUrl = 'backgroundRemoval/' + filename + '.png';

			var s3 = new AWS.S3({
				accessKeyId: s3Account.AWS_ACCESS_KEY,
				secretAccessKey: s3Account.AWS_SECRET_ACCESS_KEY,
				region : 'ap-northeast-2'
			})

			var cropContent = await fs.readFileSync(croppedDataUrl);
			var backgroundRemovalContent = await fs.readFileSync(backgroundRemovalDatalUrl);

			var paramForS3_crop = {
				'Bucket':'onionphotostorage',
				'Key' : croppedDataUrl, // '저장될 경로/파일이름' ex. /image/logo -> image 폴더에 logo.png로 저장됨. 
				'ACL':'public-read',
				//클라이언트에서 이미지 받을 때, 자동적으로 multer에서 확장자 .jpg로 받아야 할듯 -> 그럼 파이썬 코드도 바꿔야됨.
				'Body': cropContent,
				'ContentType':'image/png'
			}
			var paramForS3_backgroundRemoval = {
				'Bucket':'onionphotostorage',
				'Key' : backgroundRemovalDatalUrl,
				'ACL':'public-read',
				'Body': backgroundRemovalContent,
				'ContentType':'image/png'
			}
			var backurl = 'https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/' + backgroundRemovalDatalUrl			
			var cropurl = 'https://onionphotostorage.s3.ap-northeast-2.amazonaws.com/' + croppedDataUrl
			var resultData = {'croppedUrl': cropurl, 'backgroundUrl': backurl, 'fileName': filename, 'dominantColor': DominantColor, 'fashionClass': fashionClass};

			await s3.upload(paramForS3_crop, function(err, data){
				if (err){
					console.log(err);
				}
				console.log(data);
				s3.upload(paramForS3_backgroundRemoval, function(err, data){
					if (err){
						console.log(err);
					}
					console.log(data);
					callback(resultData);
				});
			});

			// await s3.upload(paramForS3_backgroundRemoval, function(err, data){
			// 	if (err){
			// 		console.log(err);
			// 	}
			// 	console.log(data);
			// 	callback(resultData);
			// });
			
			return resultData;

		} else {
			return false;
		}
	}

	static async sendRelatedFeedByAnalyzedPhotoForDemo(filename){
		const requestPromise = util.promisify(request.post);

		var check1 = await pythonModule.resizeImage(filename);
		var check2 = await pythonModule.getCroppedPeople(filename);
		var check3 = await pythonModule.backgroundRemoval(filename);

		if (check1 && check2){
			var DominantColor = await requestPromise({
				url: 'http://127.0.0.1:5000/getDominantColor',
				body: {'filename': filename, 'isDemo': true},
				json: true
			})
			DominantColor = DominantColor.body;

			await delay(1000);

			var fashionClass = await requestPromise({
				url: 'http://127.0.0.1:5000/classify',
				body: {'filename': filename, 'isDemo': true},
				json: true
			})
			fashionClass = fashionClass.body;

			var maxvalue = 0;
			var maxclass = '';
			for (const element of fashionClass){
			    if (element.percentage > maxvalue){
			    	maxclass = element.category
			    	maxvalue = element.percentage
			    }
			}

			//YY할 필요 없음.
			var queryResult =  await FEED_HANDLER.find({feed_category_list: [maxclass]}).sort({
				created_at : -1 //내림차순, Newest to Oldest
			})

			var resultData = {'dominantColor': DominantColor, 'fashionClass': fashionClass, 'queryResult': queryResult};
			
			return resultData;
		} else {
			return false;
		}
	}

	static async feedSenderForDemo_Category(category){
		var queryResult =  await FEED_HANDLER.find({feed_category_list: [category]}).sort({
			created_at : -1 //내림차순, Newest to Oldest
		})

		return queryResult ? queryResult : false;
	}

	static async feedSenderForDemo_Color(color){
		var queryResult =  await FEED_HANDLER.find({feed_color_list: [color]}).sort({
			created_at : -1 //내림차순, Newest to Oldest
		})

		return queryResult ? queryResult : false;
	}


	//not completed
	static async createFeed(userNickname, uploadedPhoto, feedContent, productTag, hashTag, category, color, height, gender, age, DominantColor, fashionClass){
		var feed_handler = new FEED_HANDLER();
		var file_name = crypto.randomBytes(20).toString('hex');
		var uploadedPhotoUrl = 'photo/' + file_name;
		var uploadedThumbnailUrl = 'thumbnail/' + file_name;

		var s3 = new AWS.S3({
			accessKeyId: s3Account.AWS_ACCESS_KEY,
			secretAccessKey: s3Account.AWS_SECRET_ACCESS_KEY,
			region : 'ap-northeast-2'
		})

		var photoContent = await fs.readFileSync('uploads/' + uploadedPhoto);
		var thumbnailContent = await fs.readFileSync('thumbnail/' + uploadedPhoto + '.jpg');

		var paramForS3_photo = {
			'Bucket':'onionphotostorage',
			'Key' : uploadedPhotoUrl, // '저장될 경로/파일이름' ex. /image/logo -> image 폴더에 logo.png로 저장됨. 
			'ACL':'public-read',
			//클라이언트에서 이미지 받을 때, 자동적으로 multer에서 확장자 .jpg로 받아야 할듯 -> 그럼 파이썬 코드도 바꿔야됨.
			'Body': photoContent,
			'ContentType':'image/png'
		}
		var paramForS3_thumbnail = {
			'Bucket':'onionphotostorage',
			'Key' : uploadedThumbnailUrl,
			'ACL':'public-read',
			'Body': thumbnailContent,
			'ContentType':'image/png'
		}


		await s3.upload(paramForS3_photo, function(err, data){
			if (err){
				console.log(err);
			}
			console.log(data);
		});
		await s3.upload(paramForS3_thumbnail, function(err, data){
			if (err){
				console.log(err);
			}
			console.log(data);
		});
		
		feed_handler.feed_user_nickname= userNickname;
		feed_handler.feed_photo_url = uploadedPhotoUrl;
		feed_handler.feed_thumbnail_url = uploadedThumbnailUrl;
		feed_handler.feed_hashtag = hashTag;
		feed_handler.feed_content = feedContent;
		feed_handler.feed_producttag_list = productTag;

		//유저가 선택한 카테고리 리스트
		feed_handler.feed_category_list = category;
		feed_handler.feed_color_list = color;

		//색상, 분류 클래스 top 3임. 리스트로 들어와야함. ex) ['red', 'blue', 'green']
		feed_handler.feed_DominantColor_list = DominantColor;
		feed_handler.feed_fashionClass_list = fashionClass;
		
		feed_handler.author_gender = gender;
		feed_handler.author_height = height;
		feed_handler.author_age = age;
		feed_handler.author_profile_photo = 'profile/' + userNickname;

		if (DominantColor.filter(value => color.includes(value.color)).length != 0){
			feed_handler.IsCorrectColor = 'Y'
		}
		if (fashionClass.filter(value => category.includes(value.category)).length != 0){
			feed_handler.IsCorrectClass = 'Y'
		}

		var check = await feed_handler.save()
		.then(function(result) {
		    return true;
		}).catch(function(error){
		    console.log(error);
		    return false;
		});

		return check;
	}

	//만약 전송받은 feedId가 ObjectId 객체가 아닌 String이라면 변환과정이 필요할 것.
	static async createReply(userNickname, feedId, replyContent){
		var replyDocument = { 'userNickname': userNickname, 'replyContent': replyContent };
		
		var doc = await FEED_HANDLER.findOne({ '_id': feedId });

		await doc.feed_reply_list.push(replyDocument)
		var check = await doc.save()
		.then(function(result) {
		    return true;
		}).catch(function(error){
		    console.log(error);
		    return false;
		});

		return check;
	}

	static async getFeed(feedId){
		var queryResult = await FEED_HANDLER.findOne({
			_id: feedId
		}).exec();

		return queryResult ? queryResult : false;
	}

	static async getFeedByIndexList(feedIdList){
		var returnResult = []

		for (const element of feedIdList){
		    var temp = await FeedManager.getFeed(element);
		    returnResult.push(temp);
		}

		return returnResult;
	}

	static async getPersonalRelatedList(userNickname){
		const ONE_PAGE_DATA_NUM = 30;


		var userActivityList = await UserManager.getUserActivityList(userNickname);
		var UBCF_List = await USER_DETAIL_INFO_HANDLER.find({
			user_activity_list:{$in: userActivityList}
		}).select('user_activity_list -_id')
		.sort({
			user_activity_list : -1
		})
		var feedIdList = new Set();

		//활동 기록이 70% 이상은 겹쳐야 추천대상이 됨.
		for (const list of UBCF_List) {
			var temp = list['user_activity_list'].filter(value => userActivityList.includes(value));

			if (temp.length / userActivityList.length >= 0.7){
				for (const element of list['user_activity_list']) {
					if (!userActivityList.includes(element)){
						feedIdList.add(element)
					}
				}
			}
		}

		feedIdList = [...feedIdList];

		if (feedIdList.length > 25){
			var queryResult = await FEED_HANDLER.find().select('_id').sort({
				created_at : -1 //내림차순, Newest to Oldest
			}).limit(ONE_PAGE_DATA_NUM - 25)

			var recentFeedIdList = []

			for (const list of queryResult) {
				recentFeedIdList.push(list['_id']);
			}

			feedIdList = [...feedIdList.slice(0, 25), ...recentFeedIdList]
		} else if (feedIdList.length <= 25){
			var queryResult = await FEED_HANDLER.find().select('_id').sort({
				created_at : -1 //내림차순, Newest to Oldest
			}).limit(ONE_PAGE_DATA_NUM - feedIdList.length)

			var recentFeedIdList = []

			for (const list of queryResult) {
				recentFeedIdList.push(list['_id']);
			}

			feedIdList = [...feedIdList, ...recentFeedIdList]
		}
		shuffle_array(feedIdList);
		var returnResult = await FeedManager.getFeedByIndexList(feedIdList);

		return returnResult
	}

	static async getItemBasedFeedList(feedId){
		var feedCategory = await FEED_HANDLER.findOne({_id: feedId})
		.select('feed_category_list feed_color_list')
		.then(function(result){
			return result;
		})

		var queryResult = await FEED_HANDLER.find({
			feed_category_list:{$in: feedCategory['feed_category_list']},
			feed_color_list:{$in: feedCategory['feed_color_list']},
		}).sort({created_at : -1});
		
		return returnResult;
	}

	static async getTimelineFeedList(userNickname){
		var followUserList = await UserManager.getFollowUserList(userNickname);
		var queryCondition = followUserList['user_follow_list'];
		console.log(queryCondition)
		var queryResult = await FEED_HANDLER.find({feed_user_nickname: {$in: queryCondition }}).sort({
			created_at : -1 //내림차순, Newest to Oldest
		})

		return queryResult ? queryResult : false;
	}

	static async getKeywordFeedList(keyword){
		var queryResult = await FEED_HANDLER.find({
			feed_hashtag:{$in:keyword},
		}).sort({created_at : -1});

		return queryResult;
	}

	static async getUserFeedList(userNickname){
		var queryResult =  await FEED_HANDLER.find({feed_user_nickname: userNickname}).sort({
			created_at : -1 //내림차순, Newest to Oldest
		})

		return queryResult ? queryResult : false;
	}

	//getReplyList를 원한다는 것은 FeedDetail로 들어갔다는 것.
	static async getReplyList(userNickname, feedId){
		await UserManager.addActivity(userNickname, feedId);
		
		var queryResult =  await FEED_HANDLER.find({_id: feedId}).select('feed_reply_list -_id').sort({
			created_at : 1 //오름차순, Oldest to Newest
		})

		return queryResult ? queryResult : false;
	}

	static async getProductList(feedId){
		var feed_handler = new FEED_HANDLER();
		//var product_handler = new PRODUCT_HANDLER();

		//productTag 내부 도큐먼트 마다 product_id를 가지고 있다.
		var productTagList = await FeedManager.getProductTagList(feedId);
		var productIdList = [];

		for (const doc of productTagList['feed_producttag_list']) {
			productIdList.push(doc['productId']);
		}

		var queryResult = await ProductManager.getProductByIndexList(productIdList);

		return queryResult ? queryResult : false;
	}

	static async getProductTagList(feedId){
		var queryResult =  await FEED_HANDLER.findOne({_id: feedId}).select('feed_producttag_list -_id')

		return queryResult ? queryResult : false;
	}
	
	static async updateFeed(feedId, modifiedContent){
		var check = await FEED_HANDLER.updateOne({ _id: feedId }, { feed_content: modifiedContent, updated_at: Date.now() })
		.then(function(result) {
            if(result['nModified'] !=0){
                return true;
            }
            return false;
        }).catch(function(error){
            console.log(error);
            return false;
        });

		return check;
	}
	
	static async removeFeed(feedId){
		var check = await FEED_HANDLER.deleteOne({ _id: feedId })
		.then(function(result) {
		    return true;
		}).catch(function(error){
		    console.log(error);
		    return false;
		});

		return check;
	}

	// static async removeReply(feedId, replyId){
	// 	var feed_handler = new FEED_HANDLER();
	// 	await feed_handler.deleteOne({$and:[{_id : feedId}, {feed_reply_list._id : replyId}]})
	// 	.then().catch(function(err){
	// 		if(err){
	// 			console.log(err);
	// 			return false;
	// 		}
	// 		return true
	// 	})
	// }

	static async testDataMaker(){
		var categories = new Set();
		var filelists = [];


		const getDirectories = source =>
		  readdirSync(source)

		filelists = getDirectories('./uploads/');

		var userNicknameList = ['Red','Blue','Orange','Green','Black', 'James', 'Lion', 'Rachel', 'Stone', 'Jack', 'John', 'Michael', 'Philipe', 'Minji', 'Dongjin', 'Cheolsoo', 'Jaemin', 'Jihyeon']

		for (const element of filelists) {
			categories.add(element.split('_')[0]);
		}

		for (const element of filelists) {
				var category = element.split('_')[0];
				var color = element.split('_')[1];
				var num = element.split('_')[2];
				var analyzedData = await FeedManager.analyzePhotoForDemo(element, function(data) {});

				if(!analyzedData)
					continue;

				console.log(analyzedData);
				
				await FeedManager.createFeed(userNicknameList[num % userNicknameList.length], 
					element, 'feedContent'+element, ["productId"], 
					["This","Is","Hashtag"], category, color, 1234, 'M', 23, analyzedData['dominantColor'], analyzedData['fashionClass']);
		}

		// filelists.forEach(async element=>{
		// 	for (const i of indexList.keys()) {
		// 		var category = element.split('_')[0];

		// 		var analyzedData = await FeedManager.analyzePhoto(element);

		// 		console.log(analyzedData);

		// 		var userNicknameList = ['Red','Blue','Orange','Green','Black', 'James', 'Lion', 'Rachel', 'Stone', 'Jack', 'John', 'Michael', 'Philipe', 'Minji', 'Dongjin', 'Cheolsoo', 'Jaemin', 'Jihyeon']

		// 		await FeedManager.createFeed(userNicknameList[i% userNicknameList.length], 
		// 			element, 'feedContent'+String(i), [{"productId": "5eb8dca01e12780fb866f8d2", "x":40, "y": 40}], 
		// 			["This","Is","Hashtag"], category, 1234, 'M', 23, analyzedData['dominantColor'], analyzedData['fashionClass']);
		// 	}
		// });
	}

	static async setPropensity(){
		function getRandomArbitrary(min, max) {
		  return Math.random() * (max - min) + min;
		}

		var A_list = [];
		var B_list = [];
		var C_list = [];
		var D_list = [];

		var categoryList = await FEED_HANDLER.find({feed_category_list: ['Hoodie']}).select('feed_category_list')
		.then(function(result) {
		    return result
		}).catch(function(error){
		    console.log(error);
		    return false;
		});
		var temp = []
		for (const element of categoryList) {
			temp.push(element['_id']);
		}
		for (var i = 0; i < 20; i++) {
			var item = temp[Math.floor(Math.random() * temp.length)];
			A_list.push(item);
		}
		for (var i=0; i<50; i++){
			var item = temp[Math.floor(Math.random() * temp.length)];
			B_list.push(item);
		}

		categoryList = await FEED_HANDLER.find({feed_category_list: ['Culottes']}).select('feed_category_list')
		.then(function(result) {
		    return result
		}).catch(function(error){
		    console.log(error);
		    return false;
		});
		temp = []
		for (const element of categoryList) {
			temp.push(element['_id']);
		}
		for (var i = 0; i < 20; i++) {
			var item = temp[Math.floor(Math.random() * temp.length)];
			A_list.push(item);
		}

		categoryList = await FEED_HANDLER.find({feed_category_list: ['Cutoffs']}).select('feed_category_list')
		.then(function(result) {
		    return result
		}).catch(function(error){
		    console.log(error);
		    return false;
		});
		temp = []
		console.log(temp);
		for (const element of categoryList) {
			temp.push(element['_id']);
		}
		for (var i = 0; i < 10; i++) {
			var item = temp[Math.floor(Math.random() * temp.length)];
			A_list.push(item);
		}
		
		await USER_DETAIL_INFO_HANDLER.updateOne({user_nickname:'Black'}, {user_activity_list: A_list});

		var userNicknameList = ['Black', 'James', 'Lion', 'Rachel', 'Stone', 'Jack', 'John', 'Michael', 'Philipe', 'Minji', 'Dongjin', 'Cheolsoo', 'Jaemin', 'Jihyeon']
		var dp = new Array(50);
		var idx = 0
		var randIdx = 0
		while(idx < 40){
			randIdx = Math.floor(Math.random() * 50);
			if(!dp[randIdx]){
				B_list.push(A_list[randIdx]);
				dp[randIdx] = true;
				idx = idx + 1;
			}
		}
		categoryList = await FEED_HANDLER.find({feed_category_list: ['Sweater']}).select('feed_category_list')
		.then(function(result) {
		    return result
		}).catch(function(error){
		    console.log(error);
		    return false;
		});
		temp = []
		for (const element of categoryList) {
			temp.push(element['_id']);
		}
		for (var i = 0; i < 30; i++) {
			var item = temp[Math.floor(Math.random() * temp.length)];
			C_list.push(item);
		}

		dp = new Array(50);
		idx = 0
		randIdx = 0
		while(idx < 40){
			randIdx = Math.floor(Math.random() * 50);
			if(!dp[randIdx]){
				C_list.push(A_list[randIdx]);
				dp[randIdx] = true;
				idx = idx + 1;
			}
		}

		dp = new Array(50);
		idx = 0
		randIdx = 0
		while(idx < 40){
			randIdx = Math.floor(Math.random() * 50);
			if(!dp[randIdx]){
				D_list.push(A_list[randIdx]);
				dp[randIdx] = true;
				idx = idx + 1;
			}
		}
		categoryList = await FEED_HANDLER.find({feed_category_list: ['Blouse']}).select('feed_category_list')
		.then(function(result) {
		    return result
		}).catch(function(error){
		    console.log(error);
		    return false;
		});
		temp = []
		for (const element of categoryList) {
			temp.push(element['_id']);
		}
		for (var i = 0; i < 30; i++) {
			var item = temp[Math.floor(Math.random() * temp.length)];
			D_list.push(item);
		}
		console.log(B_list);
		await USER_DETAIL_INFO_HANDLER.updateOne({user_nickname:'James'}, {user_activity_list: B_list});
		await USER_DETAIL_INFO_HANDLER.updateOne({user_nickname:'Lion'}, {user_activity_list: C_list});
		await USER_DETAIL_INFO_HANDLER.updateOne({user_nickname:'Rachel'}, {user_activity_list: D_list});


		return;
	}
}


module.exports = FeedManager;