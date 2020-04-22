var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var USER_AUTH_INFO_Schema = new Schema(
  {
    user_email: String,
    user_nickname: String,
	user_password: String,
	user_status: { type: String, enum: ['Y', 'N', 'D'], default: 'Y'},
	user_cert: { type: String, enum: ['Y', 'N'], default: 'N'},
	user_auth: { type: String, enum: ['U', 'A', 'B'], default: 'U'},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	deleted_at: Date
  },
  { collection: 'USER_AUTH_INFO', versionKey: "__v" }
);

//if collection name is not defined in new Schema(), then collection names is "default_collection"
module.exports = mongoose.model("default_collection4", USER_AUTH_INFO_Schema);