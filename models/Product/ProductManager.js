const PRODUCT_HANDLER = require("../../schemas/PRODUCT");

class ProductManager{
	static async getProductById(productId){
		const queryResult = await PRODUCT_HANDLER.findOne({
			_id: productId
		}).exec();

		return queryResult ? queryResult : false;
	}

	static async getProductListByCategoryAndBrand(category, brandIdx){
		const queryResult = await PRODUCT_HANDLER.find({
			product_category: category,
			product_brand_idx: brandIdx
		});

		return queryResult ? queryResult : false;
	}

	static async addProduct(productName, productBrand, productCategory, productColor, productPrice, productStock, productThumbnailUrl, productPageUrl){
		var product_handler = new PRODUCT_HANDLER();
		product_handler.product_name = productName;
		product_handler.product_brand_idx = productBrand;
		product_handler.product_category = productCategory;
		product_handler.product_color = productColor;
		product_handler.product_stock = productStock;
		product_handler.product_price = productPrice;
		product_handler.product_thumbnail_url = productThumbnailUrl;
		product_handler.product_page_url = productPageUrl;

		await product_handler.save((err) => {
			if (err){ 
				console.log(err);
				return false;
			 }
			return true;
		})
	}

	static async removeProduct(productId){
		await PRODUCT_HANDLER.deleteOne({_id: productId}, (err) => {
			if(err){
				console.log(err);
				return false;
			}
			return true
		})
	}

	//update product stock으로 합쳐도 될 것 같아서 구현 보류함
	static async increaseProductStock(productId, stockData){
	}

	static async decreaseProductStock(productId, stockData){
	}

	static async updateProductPrice(productId, productPrice){
		await PRODUCT_HANDLER.updateOne({_id: productId},{product_price: productPrice, updated_at: Date.now()},(err)=>{
			if(err){
				console.log(err);
				return false;
			}
			return true
		});
	}

	static async updateDiscountRate(productId, productDiscountRate){
		const queryResult = await PRODUCT_HANDLER.findOne({
			_id: productId
		}).exec();
		const discountPrice = queryResult.product_price * productDiscountRate;

		await PRODUCT_HANDLER.updateOne({_id: productId},{product_price: discountPrice, updated_at: Date.now()},(err)=>{
			if(err){
				console.log(err);
				return false;
			}
			return true
		});
	}

	static async updateProduct(productId, brandId, productName, productCategory, productSize, productColor, productPrice, productStock, productThumbnailUrl, productPageUrl){
		await PRODUCT_HANDLER.updateOne({_id: productId}, {
			product_name:productName,
			product_brand_idx:brandId,
			product_category:productCategory,
			product_color:productColor,
			product_price:productPrice,
			product_thumbnail_url:productThumbnailUrl,
			product_stock:productStock,
			product_size: productSize,
			product_page_url:productPageUrl,
			updated_at:Date.now()
		}, (err)=>{
			if(err){
				console.log(err)
				return false;
			}
			return true;
		})
	}
}

module.exports = ProductManager;

