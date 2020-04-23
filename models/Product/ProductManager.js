const PRODUCT_HANDLER = require("../../schemas/PRODUCT");

class ProductManager{
	static async getProductById(productId){
	}

	static async getProductListByCategoryAndBrand(category, brand){
	}

	static async addProduct(productName, productBrand, productCategory, productColor, productPrice, productStock, productThumbnailUrl, productPageUrl){
	}

	static async removeProduct(productId){
	}

	static async increaseProductStock(productId, stockData){
	}

	static async decreaseProductStock(productId, stockData){
	}

	static async updateProductPrice(productId, productPrice){
	}

	static async updateDiscountRate(productId, productDiscountRate){
	}

	static async updateProduct(prodcutId, brandId, productName, productCategory, productSize, productColor, productPrice, productStock, productThumbnailUrl, productPageUrl){
	}
}

module.exports = ProductManager;

