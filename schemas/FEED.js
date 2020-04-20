var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FEED_Schema = new Schema(
  {
	feed_photo_url: String,
	feed_thumbnail_url: String,
	feed_hashtag: [String],
	feed_content: String,
	feed_like_list: [String],
	feed_reply_list: { type: Array , default: [] },
	feed_producttag_list: { type: Array , default: [] },
	feed_category_list: [String],
	feed_feature_list: [String],
	feed_style_list: [String],
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	deleted_at: Date
  },
  { collection: 'FEED', versionKey: "__v" }
);

//if collection name is not defined in new Schema(), then collection names is "default_collection"
module.exports = mongoose.model("default_collection", FEED_Schema);