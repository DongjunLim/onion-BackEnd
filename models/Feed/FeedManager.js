const FEED_HANDLER = require("../../schemas/FEED");
const UserManager = require("../User/UserManager");
const AWS = require('aws-sdk');
const s3Account = require("../../s3Account.json");
const crypto = require("crypto");

class FeedManager{

	//not completed
	static async createFeed(userNickname, uploadedPhoto, feedContent, productTag, hashTag, category, height, gender, age){
		var feed_handler = new FEED_HANDLER();
		var file_name = crypto.randomBytes(20).toString('hex');
		var uploadedPhotoUrl = 'photo/' + file_name;
		var uploadedThumbnailUrl = 'thumbnail/' + file_name;
	


		var s3 = new AWS.S3({
			accessKeyId: s3Account.AWS_ACCESS_KEY,
			secretAccessKey: s3Account.AWS_SECRET_ACCESS_KEY,
			region : 'ap-northeast-2'
		})

		/*
			리사이즈 프로세스 필요 (썸네일)
		*/


		var paramForS3_photo = {
			'Bucket':'onionphotostorage',
			'Key' : uploadedPhotoUrl, // '저장될 경로/파일이름' ex. /image/logo -> image 폴더에 logo.png로 저장됨. 
			'ACL':'public-read',
			'Body': uploadedPhoto,
			'ContentType':'image/png'
		}
		var paramForS3_thumbnail = {
			'Bucket':'onionphotostorage',
			'Key' : uploadedThumbnailUrl,
			'ACL':'public-read',
			'Body': uploadedPhoto,
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
		분류기 관련

		feed_handler.feed_feature_list: [String],
		feed_handler.feed_style_list: [String],
		*/

		feed_handler.author_gender = gender;
		feed_handler.author_height = height;
		feed_handler.author_age = age;

		await feed_handler.save(function(err){
			if(err){
				console.log(err);
				return false;
			}
			return true
		});
	}

	//만약 전송받은 feedId가 ObjectId 객체가 아닌 String이라면 변환과정이 필요할 것.
	static async createReply(userNickname, feedId, replyContent){
		//var feed_handler = new FEED_HANDLER();
		//reply 스키마 만들것
		var replyDocument = { 'userNickname': userNickname, 'replyContent': replyContent, 'created_at': Date.now };

		console.log(feedId)

		await FEED_HANDLER.updateOne(
		    { '_id': feedId }, 
		    { $push: { feed_reply_list: replyDocument }}
		).then().catch(function(err){
			if(err){
				console.log(err);
				return false;
			}
			return true
		})
	}

	static async getFeed(feedId){
		//var feed_handler = new FEED_HANDLER();
		
		var queryResult = await FEED_HANDLER.findOne({
			_id: feedId
		}).exec();

		return queryResult ? queryResult : false;
	}

	static async getPersonalRelatedList(){

	}
	static async getItemBasedFeedList(){

	}
	static async getTimelineFeedList(){
	//not completed
	}

	static async getTimelineFeedList(userNickname){
		/*
		토큰으로 닉네임 가져오기?

		가져온 팔로우 리스트로 타임라인 데이터 조합 및 전송

		var followUserList = UserManager.getFollowUserList(userNickname);
		*/
	}
	static async getUserFeedList(){
	//not completed
	}
	static async getUserFeedList(userNickname){
		var feed_handler = new FEED_HANDLER();

		var queryResult =  await feed_handler.find({feed_user_nickname: userNickname}).sort({
			created_at : -1 //내림차순, Newest to Oldest
		})

		return queryResult ? queryResult : false;
	}

	static async getReplyList(feedId){
		var feed_handler = new FEED_HANDLER();

		var queryResult =  await feed_handler.find({_id: feedId}).select('feed_reply_list -_id').sort({
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
		var feed_handler = new FEED_HANDLER();

		var queryResult =  await feed_handler.find({_id: feedId}).select('feed_producttag_list -_id').sort({
			created_at : 1 //오름차순, Oldest to Newest
		})

		return queryResult ? queryResult : false;
	}
	
	static async updateFeed(feedId, modifiedContent){
		var feed_handler = new FEED_HANDLER();

		await feed_handler.update({ _id: feedId }, { feed_content: modifiedContent })
		.then().catch(function(err){
			if(err){
				console.log(err);
				return false;
			}
			return true
		})
	}
	
	static async removeFeed(feedId){
		var feed_handler = new FEED_HANDLER();

		await feed_handler.deleteOne({ _id: feedId })
		.then().catch(function(err){
			if(err){
				console.log(err);
				return false;
			}
			return true
		})
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