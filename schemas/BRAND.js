var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BRAND_Schema = new Schema(
  {
	brand_name: String,
	brand_logo_url: String,
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	deleted_at: Date
  },
  { collection: 'BRAND', versionKey: "__v" }
);

//if collection name is not defined in new Schema(), then collection names is "default_collection"
module.exports = mongoose.model("default_collection", BRAND_Schema);