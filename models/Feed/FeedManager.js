const FEED_HANDLER = require("../../schemas/FEED");
const UserManager = require("../User/UserManager");
const AWS = require('aws-sdk');
const s3Account = require("../../s3Account.json");
const crypto = require("crypto");
const mongoose = require("mongoose");
const pythonModule = require('../../pythonCode/Servicer');

class FeedManager{
	static async analyzePhoto(filename){
		await pythonModule.resizeImage(filename);
		await pythonModule.getCroppedPeople(filename);

		var DominantColor = await pythonModule.getDominantColorOfImage(filename);
		var fashionClass = await pythonModule.fashionClassification(filename);

		return {'DominantColor': DominantColor, 'fashionClass': fashionClass};
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

		/*
		feed_handler.feed_feature_list: [String],
		feed_handler.feed_style_list: [String],
		*/
		
		feed_handler.author_gender = gender;
		feed_handler.author_height = height;
		feed_handler.author_age = age;

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

	static async getPersonalRelatedList(){

	}
	static async getItemBasedFeedList(){

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

	static async getReplyList(feedId){
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
}


module.exports = FeedManager;