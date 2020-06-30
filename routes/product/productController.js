const ProductManager = require('../../models/Product/ProductManager');
const FeedManager = require('../../models/Feed/FeedManager');
const UserManager = require('../../models/User/UserManager');
module.exports.productController = {

    //API18
    getProduct: async (req, res) => {
        const { productId } = req.params;

        const output = await ProductManager.getProductById(productId);

        return output ? res.send(output) : res.sendStatus(202);
    },

    //API19
    getProductList: async (req,res) => {
        const { brandName } = req.query;

        const output = await ProductManager.getProductListByBrand(brandName);
        jsonData = new Array();
        await output.forEach(async element=>{
            temp = new Object();
            temp['productId'] = element['_id']
            temp['productName'] = element.product_name;
            temp['productBrand'] = element.product_brand;
            temp['productPrice'] = element.product_price;
            temp['productWebUrl'] = element.product_page_url;
            temp['productImageUrl'] = element.product_photo_url;
            await jsonData.push(temp);
        })
        

        responseData = { products:jsonData};
        console.log(responseData);
        return output ? res.send(responseData) : res.sendStatus(202);
        
    },

    //API20
    buyProduct: async (req,res) => {
        const { productId } = req.body;

        const output = await UserManager.buyProduct(req.userNickname, productId);

        return output ? res.sendStatus(200) : res.sendStatus(202);
    },

}