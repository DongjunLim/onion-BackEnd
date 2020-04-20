var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PRODUCT_Schema = new Schema(
  {
	product_brand_idx: Number,
	product_category: String,
	product_color: String,
	product_price: Number,
	product_stock: { type: Array , default: [] },
	product_thumbnail_url: String,
	product_page_url: String,
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	deleted_at: Date
  },
  { collection: 'PRODUCT', versionKey: "__v" }
);

//if collection name is not defined in new Schema(), then collection names is "default_collection"
module.exports = mongoose.model("default_collection", PRODUCT_Schema);