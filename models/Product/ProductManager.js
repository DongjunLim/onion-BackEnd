const PRODUCT_HANDLER = require("../../schemas/PRODUCT");

class ProductManager{
	static async getProductById(productId){
		const queryResult = await PRODUCT_HANDLER.findOne({
			_id: productId
		}).exec();

		return queryResult ? queryResult : false;
	}

	static async getProductByIndexList(productIdIndex){
		var returnResult = []

		for (const element of productIdIndex){
		    var temp = await ProductManager.getProductById(element);
		    returnResult.push(temp);
		}

		return returnResult;
	}

	static async getProductListByBrand(brandName){
		const queryResult = await PRODUCT_HANDLER.find({
			product_brand: brandName
		});
		return queryResult ? queryResult : false;
	}

	static async addProduct(productName, productBrand, productCategory, productColor, productPrice, productStock, productThumbnailUrl, productPageUrl){
		var product_handler = new PRODUCT_HANDLER();
		product_handler.product_name = productName;
		product_handler.product_brand = productBrand;
		product_handler.product_category = productCategory;
		product_handler.product_color = productColor;
		product_handler.product_stock = productStock;
		product_handler.product_price = productPrice;
		product_handler.product_thumbnail_url = productThumbnailUrl;
		product_handler.product_page_url = productPageUrl;

		var check = await product_handler.save()
		.then(function(result) {
            return true;
        }).catch(function(error){
            console.log(error);
            return false;
        });

        return check;
	}

	static async removeProduct(productId){
		var check = await PRODUCT_HANDLER.deleteOne({_id: productId})
		.then(function(result) {
		    return true;
		}).catch(function(error){
		    console.log(error);
		    return false;
		})

		return check;
	}

	static async increaseProductStock(productId, stockData){
	}

	static async decreaseProductStock(productId, stockData){
	}

	static async updateProductPrice(productId, productPrice){
		var check = await PRODUCT_HANDLER.updateOne({_id: productId},{product_price: productPrice, updated_at: Date.now()})
		.then(function(result) {
		    return true;
		}).catch(function(error){
		    console.log(error);
		    return false;
		})

		return check;
	}

	static async updateDiscountRate(productId, productDiscountRate){
		const queryResult = await PRODUCT_HANDLER.findOne({
			_id: productId
		}).exec();
		const discountPrice = queryResult.product_price * productDiscountRate;

		var check = await PRODUCT_HANDLER.updateOne({_id: productId},{product_price: discountPrice, updated_at: Date.now()})
		.then(function(result) {
		    return true;
		}).catch(function(error){
		    console.log(error);
		    return false;
		})

		return check;
	}

	static async updateProduct(productId, brandName, productName, productCategory, productColor, productPrice, productStock, productThumbnailUrl, productPageUrl){
		var check = await PRODUCT_HANDLER.updateOne({_id: productId}, {
			product_name:productName,
			product_brand: brandName,
			product_category:productCategory,
			product_color:productColor,
			product_price:productPrice,
			product_thumbnail_url:productThumbnailUrl,
			product_stock:productStock,
			product_page_url:productPageUrl,
			updated_at:Date.now()
		})
		.then(function(result) {
		    return true;
		}).catch(function(error){
		    console.log(error);
		    return false;
		})

		return check;
	}
}

module.exports = ProductManager;

