const ProductManager = require('../../models/Product/ProductManager');
const FeedManager = require('../../models/Feed/FeedManager');
const UserManager = require('../../models/User/UserManager');
module.exports.productController = {

    //API18
    getProduct: async (req, res) => {
        const { productId } = req.body;

        const output = await ProductManager.getProductById(productId);

        return output ? res.send(output) : res.sendStatus(202);
    },

    //API19
    getProductList: (req,res) => {
        const { brand , category } = req.body;

        const output = await ProductManager.getProductListByCategoryAndBrand(category, brand);

        return output ? res.send(output) : res.sendStatus(202);
        
    },

    //API20
    buyProduct: (req,res) => {
        const { productId } = req.body;

        const output = await UserManager.buyProduct(req.userNickname, productId);

        return output ? res.sendStatus(200) : res.sendStatus(202);
    },

}