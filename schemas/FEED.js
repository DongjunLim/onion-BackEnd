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
	feed_category_list: [String],
	feed_DominantColor_list: [String],
	feed_fashionClass_list: { type: Array , default: [] },
	author_gender: { type: String, enum: ['M', 'W', 'None'], default: 'None'},
	author_height: Number,
	author_age: Number,
	author_profile_photo: String,
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	deleted_at: Date
  },
  { collection: 'FEED', versionKey: "__v" }
);

//if collection name is not defined in new Schema(), then collection names is "default_collection"
module.exports = mongoose.model("default_collection2", FEED_Schema);