const mongoose = require('mongoose');
const dbAccount = require("../mongoAccount.json");
const AuthManager = require("../models/Auth/AuthManager");
const DB_options = {
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500 , // Reconnect every 500ms
    poolSize: 10 , // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
}

mongoose.connect(
    "mongodb://"+ dbAccount.mongooseID +":" + dbAccount.mongoosePW + "@ec2-13-124-252-7.ap-northeast-2.compute.amazonaws.com:27017/onion_BackEnd?authSource=admin"
    , DB_options ).then(
    () => { console.log('Successfully connected to mongodb'); } ,
    err => { console.error.bind(console,'Check DB - Connection error : '); }
)

const BRAND_HANDLER = require("./BRAND");
const PRODUCT_HANDLER = require("./PRODUCT");
const FEED_HANDLER = require("./FEED");
const USER_AUTH_INFO_HANDLER = require("./USER_AUTH_INFO");
const USER_DETAIL_INFO_HANDLER = require("./USER_DETAIL_INFO");


var feed_handler = FEED_HANDLER;


for (var i = 0; i < 5; i++){
	var brand_handler = new BRAND_HANDLER();

	brand_handler.brand_name = 'brandName' + String(i);
	brand_handler.brand_logo_url = 'brandLogoUrl' + String(i);

	brand_handler.save()
}

for (var i = 0; i < 40; i++){
	var product_handler = new PRODUCT_HANDLER();

	product_handler.product_name= 'productName' + String(i);
	product_handler.product_brand= 'brandName' + String(i%5);
	product_handler.product_category= 'Tee';
	product_handler.product_color= ["Red", "Green"];
	product_handler.product_price= i;
	product_handler.product_stock= [{"XL" :5}, {"L": 10}];
	product_handler.product_thumbnail_url= 'productThumbnail' + String(i);
	product_handler.product_page_url= 'productpage' + String(i);

	product_handler.save()
}

 foo = async () =>{
	var userNicknameList = ['Red','Blue','Orange','Green','Black', 'James', 'Lion', 'Rachel', 'Stone', 'Jack', 'John', 'Michael', 'Philipe', 'Minji', 'Dongjin', 'Cheolsoo', 'Jaemin', 'Jihyeon']
	var pass = await AuthManager.encryptPassword("userPassword123!");


	for (var i = 0; i < userNicknameList.length ; i++){
		var user_auth_info_handler = new USER_AUTH_INFO_HANDLER();
		var user_detail_info_handler = new USER_DETAIL_INFO_HANDLER();

		user_auth_info_handler.user_email = userNicknameList[i] + "@gmail.com";
		user_auth_info_handler.user_nickname = userNicknameList[i];
		
		user_auth_info_handler.user_password = pass;

		user_detail_info_handler.user_nickname = userNicknameList[i];
		user_detail_info_handler.user_height = 180.8;
		user_detail_info_handler.user_age = 23;
		user_detail_info_handler.user_address = ["userAddress1", "userAddress2"];
		user_detail_info_handler.user_Instagram_url = "Insta.url/" + String(i);
		user_detail_info_handler.user_profilephoto_url = "profileUrl/" + String(i);

		await user_auth_info_handler.save()
		await user_detail_info_handler.save()
	}
}

foo();

/*
for (var i = 0; i <; i++){
  	feed_handler.feed_user_nickname: String,
	feed_handler.feed_photo_url: String,
	feed_handler.feed_thumbnail_url: String,
	feed_handler.feed_hashtag: [String],
	feed_handler.feed_content: String,
	feed_handler.feed_like_list: { type: Array , default: [] },
	feed_handler.feed_reply_list: [REPLY_Schema],
	feed_handler.feed_producttag_list: { type: Array , default: [] },
	feed_handler.feed_category_list: [String],
	feed_handler.feed_feature_list: [String],
	feed_handler.feed_style_list: [String],
	feed_handler.author_gender: { type: String, enum: ['M', 'W', 'None'], default: 'None'},
	feed_handler.author_height: Number,
	feed_handler.author_age: Number,
	feed_handler.created_at: { type: Date, default: Date.now },
	feed_handler.updated_at: { type: Date, default: Date.now },
	feed_handler.deleted_at: Date
}
*/