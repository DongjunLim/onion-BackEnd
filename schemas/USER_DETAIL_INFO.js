var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var USER_DETAIL_INFO_Schema = new Schema(
  {
    user_nickname: String,
	user_gender: { type: String, enum: ['M', 'W', 'None'], default: 'None'},
	user_height: Number,
	user_age: Number,
	user_address: [{address1: String, address1: String}],
	user_Instagram_url: String,
	user_profilephoto_url: String,
	user_feed_list: [String],
	user_activity_list: { type: Array , default: [] },
	user_history_list: { type: Array , default: [] },
	user_follow_list: [String],
	user_follower_list: [String],
	user_bookmark_list: [String],
	user_bucket_list: [Number],
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	deleted_at: Date
  },
  { collection: 'USER_DETAIL_INFO', versionKey: "__v" }
);

//if collection name is not defined in new Schema(), then collection names is "default_collection"
module.exports = mongoose.model("default_collection5", USER_DETAIL_INFO_Schema);