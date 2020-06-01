var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var REPLY_Schema = new Schema({
	userNickname: String,
	replyContent: String,
	created_at: { type: Date, default: Date.now }
});

var FEED_Schema = new Schema(
  {
  	feed_user_nickname: String,
	feed_photo_url: String,
	feed_thumbnail_url: String,
	feed_hashtag: [String],
	feed_content: String,
	feed_like_list: { type: Array , default: [] },
	feed_reply_list: [REPLY_Schema],
	feed_producttag_list: { type: Array , default: [] },
	//유저가 선택한 카테고리
	feed_category_list: [String],
	feed_color_list: [String],

	//색상, 분류 클래스 top 3임. 리스트로 들어와야함. ex) ['red', 'blue', 'green']
	feed_DominantColor_list: { type: Array , default: [] },
	feed_fashionClass_list: { type: Array , default: [] },
	
	author_gender: { type: String, enum: ['M', 'W', 'None'], default: 'None'},
	author_height: Number,
	author_age: Number,
	author_profile_photo: String,
	IsCorrectClass: { type: String, enum: ['Y', 'N'], default: 'N'},
	IsCorrectColor: { type: String, enum: ['Y', 'N'], default: 'N'},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	deleted_at: Date
  },
  { collection: 'FEED', versionKey: "__v" }
);

//if collection name is not defined in new Schema(), then collection names is "default_collection"
module.exports = mongoose.model("default_collection2", FEED_Schema);