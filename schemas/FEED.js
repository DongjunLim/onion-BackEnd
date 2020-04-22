var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FEED_Schema = new Schema(
  {
  	feed_user_nickname: String,
	feed_photo_url: String,
	feed_thumbnail_url: String,
	feed_hashtag: [String],
	feed_content: String,
	feed_like_list: { type: Array , default: [] },
	feed_reply_list: { type: Array , default: [] },
	feed_producttag_list: { type: Array , default: [] },
	feed_category_list: [String],
	feed_feature_list: [String],
	feed_style_list: [String],
	author_gender: { type: String, enum: ['M', 'W', 'None'], default: 'None'},
	author_height: Number,
	author_age: Number,
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	deleted_at: Date
  },
  { collection: 'FEED', versionKey: "__v" }
);

//if collection name is not defined in new Schema(), then collection names is "default_collection"
module.exports = mongoose.model("default_collection2", FEED_Schema);