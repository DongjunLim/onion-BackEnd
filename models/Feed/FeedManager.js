const FEED_HANDLER = require("../../schemas/FEED");
const UserManager = require("../User/UserManager");

class FeedManager{
	static async createFeed(uploadedPhoto, feedContent, productTag, hashTag, category, height, gender, age){
		var feed_handler = new FEED_HANDLER();

		/*
			썸네일 생성 코드

			스토리지에 사진과 썸네일을 넣고 경로를 반환하는 코드
			var uploadedPhotoUrl = ~~~
			var uploadedThumbnailUrl = ~~~
		*/

		/*
		//토큰 열어서 닉네임 사용
		feed_handler.feed_user_nickname: String;
		*/

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

		await postModel.save(function(err){
			if(err){
				console.log(err);
				return false;
			}
			return true
		});
	}

	static async createReply(feedId, userNickname, replyContent){
		var feed_handler = new FEED_HANDLER();
		var replyDocument = { 'userNickname': userNickname, 'replyContent': replyContent, 'created_at': Date.now };

		await feed_handler.update(
		    { _id: feedId }, 
		    { $push: { feed_reply_list: replyDocument } },
		).then().catch(function(err){
			if(err){
				console.log(err);
				return false;
			}
			return true
		})
	}

	static async getFeed(feedId){
		var feed_handler = new FEED_HANDLER();

		var queryResult = await feed_handler.findOne({
			_id: feedId
		}).exec();

		return queryResult ? queryResult : false;
	}

	static async getPersonalRelatedList(){

	}
	static async getItemBasedFeedList(){

	}
	static async getTimelineFeedList(){
		/*
		토큰으로 닉네임 가져오기?

		가져온 팔로우 리스트로 타임라인 데이터 조합 및 전송

		var followUserList = UserManager.getFollowUserList(userNickname);
		*/
	}

	static async getUserFeedList(){
		var feed_handler = new FEED_HANDLER();
		/*
		토큰으로 닉네임 가져오기?
		var userNickname = ~~
		*/
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
	
	static async updateFeed(password){

	}
	static async removeFeed(password){

	}
	static async removeReply(password){

	}
}


module.exports = FeedManager;