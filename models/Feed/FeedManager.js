const FEED_HANDLER = require("../../schemas/FEED");
const USER_DETAIL_INFO_HANDLER = require("../../schemas/USER_DETAIL_INFO");
const UserManager = require("../User/UserManager");
const AWS = require('aws-sdk');
const s3Account = require("../../s3Account.json");
const crypto = require("crypto");
const mongoose = require("mongoose");
const pythonModule = require('../../pythonCode/Servicer');

//for Test
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')


class FeedManager{
	static async analyzePhoto(filename){
		//반드시 주석 풀어주기!!!
		// await pythonModule.resizeImage(filename);
		// await pythonModule.getCroppedPeople(filename);

		var DominantColor = await pythonModule.getDominantColorOfImage(filename);
		var fashionClass = await pythonModule.fashionClassification(filename);

		return {'fileName': filename, 'dominantColor': DominantColor, 'fashionClass': fashionClass};
	}

	//not completed
	static async createFeed(userNickname, uploadedPhoto, feedContent, productTag, hashTag, category, height, gender, age, DominantColor, fashionClass){
		var feed_handler = new FEED_HANDLER();
		var file_name = crypto.randomBytes(20).toString('hex');
		var uploadedPhotoUrl = 'photo/' + file_name;
		var uploadedThumbnailUrl = 'thumbnail/' + file_name;

		var s3 = new AWS.S3({
			accessKeyId: s3Account.AWS_ACCESS_KEY,
			secretAccessKey: s3Account.AWS_SECRET_ACCESS_KEY,
			region : 'ap-northeast-2'
		})

		var paramForS3_photo = {
			'Bucket':'onionphotostorage',
			'Key' : uploadedPhotoUrl, // '저장될 경로/파일이름' ex. /image/logo -> image 폴더에 logo.png로 저장됨. 
			'ACL':'public-read',
			//클라이언트에서 이미지 받을 때, 자동적으로 multer에서 확장자 .jpg로 받아야 할듯 -> 그럼 파이썬 코드도 바꿔야됨.
			'Body': 'uploads/' + uploadedPhoto,
			'ContentType':'image/png'
		}
		var paramForS3_thumbnail = {
			'Bucket':'onionphotostorage',
			'Key' : uploadedThumbnailUrl,
			'ACL':'public-read',
			'Body': 'thumbnail/' + uploadedPhoto + '.jpg',
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
		feed_handler.feed_category_list = category;

		feed_handler.feed_DominantColor_list = DominantColor;
		feed_handler.feed_fashionClass_list = fashionClass;
		
		feed_handler.author_gender = gender;
		feed_handler.author_height = height;
		feed_handler.author_age = age;
		feed_handler.author_profile_photo = 'profile/' + userNickname;
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

		if (feedIdList.length > ONE_PAGE_DATA_NUM / 2){
			var queryResult = await FEED_HANDLER.find().select('_id').sort({
				created_at : -1 //내림차순, Newest to Oldest
			}).limit(ONE_PAGE_DATA_NUM - (~~(ONE_PAGE_DATA_NUM / 2)))

			var recentFeedIdList = []

			for (const list of queryResult) {
				recentFeedIdList.push(list['_id']);
			}

			feedIdList = [...feedIdList.slice(0, ~~(ONE_PAGE_DATA_NUM / 2)), ...recentFeedIdList]
		} else if (feedIdList.length <= ONE_PAGE_DATA_NUM / 2){
			var queryResult = await FEED_HANDLER.find().select('_id').sort({
				created_at : -1 //내림차순, Newest to Oldest
			}).limit(ONE_PAGE_DATA_NUM - feedIdList.length)

			var recentFeedIdList = []

			for (const list of queryResult) {
				recentFeedIdList.push(list['_id']);
			}

			feedIdList = [...feedIdList, ...recentFeedIdList]
		}

		var returnResult = await FeedManager.getFeedByIndexList(feedIdList);

		return returnResult
	}

	static async getItemBasedFeedList(feedId){
		var feedCategory = await FEED_HANDLER.findOne({_id: feedId})
		.then(function(result){
			return result[0]['feed_category_list'];
		})

		var queryResult = await FEED_HANDLER.find({
			feed_category_list:{$in: feedCategory}
		}).select('feed_category_list').sort({created_at : -1});

		var IBCF_List = [];

		//카테고리가 70% 이상의 유사도를 보이면 유사 게시글로서 등장.
		for (const list of queryResult) {
			var temp = list['feed_category_list'].filter(value => feedCategory.includes(value));

			if (temp.length / feedCategory.length >= 0.7){
				IBCF_List.push(list['_id'])
			}
		}

		var returnResult = await FeedManager.getFeedByIndexList(IBCF_List);

		return returnResult;
	}

	static async getTimelineFeedList(userNickname){
		var queryCondition = [];
		var followUserList = await UserManager.getFollowUserList(userNickname);
		
		await followUserList.forEach(function(element){
			queryCondition.push({'feed_user_nickname': element});
		})

		var queryResult = await FEED_HANDLER.find({ $or:queryCondition }).sort({
			created_at : -1 //내림차순, Newest to Oldest
		})

		return queryResult ? queryResult : false;
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

		var productIdList = new Array();
		var productList = new Array();

		//productTag 내부 도큐먼트 마다 product_id를 가지고 있다.
		var productTagList =  getProductTagList(feedId)

		await productTagList.forEach(function(element){
			productIdList.push(element.product_id);
		})

		/*
		추출해낸 productId를 ProductManager 내부의 getProductById를 사용하여 제품정보를 조합하여 전송

		await productIdList.forEach(function(element){
			productList.push(product_handler.getProductById(element));
		})
		*/

		return productList ? productList : false;
	}

	static async getProductTagList(feedId){
		var queryResult =  await FEED_HANDLER.find({_id: feedId}).select('feed_producttag_list -_id')

		return queryResult ? queryResult : false;
	}
	
	static async updateFeed(feedId, modifiedContent){
		var check = await FEED_HANDLER.updateOne({ _id: feedId }, { feed_content: modifiedContent, updated_at: Date.now() })
		.then(function(result) {
		    return true;
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
		const isDirectory = source => lstatSync(source).isDirectory()
		const getDirectories = source =>
		  readdirSync(source).map(name => join(source, name)).filter(isDirectory)

		var subdirectories = getDirectories('cropped/feedTestData')
		console.log(subdirectories);

		for (const element of subdirectories) {
			for (var i = 0; i < 30; i++) {
				var category = element.split('\\')[2];

				var pictureName = 'feedTestData/'+category+'/img_'+String(i);
				console.log(pictureName)
				var analyzedData = await FeedManager.analyzePhoto(pictureName);

				console.log(analyzedData);

				var userNicknameList = ['Red','Blue','Orange','Green','Black', 'James', 'Lion', 'Rachel', 'Stone', 'Jack', 'John', 'Michael', 'Philipe', 'Minji', 'Dongjin', 'Cheolsoo', 'Jaemin', 'Jihyeon']

				await FeedManager.createFeed(userNicknameList[i% userNicknameList.length], 
					pictureName, 'feedContent'+String(i), [{"productId": "5eb24aa8153b7b34d82121b0", "x":40, "y": 40}], 
					["This","Is","Hashtag"], category, 1234, 'M', 23, analyzedData['dominantColor'], analyzedData['fashionClass']);
			}
		}
	}
}


module.exports = FeedManager;