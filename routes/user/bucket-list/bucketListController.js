const UserManager = require('../../../models/Profile/ProfileManager');


module.exports.bucketListController = {

    //설계서에 메소드 누락.
    //API32
    getBucketList : async (req,res) => {

    },

    //API33
    addBucketList : async (req,res) => {
        const { productId } = req.body;
        
        const output = await UserManager.addBucketList(req.userNickname, productId);

        return output ? res.sendStatus(201) : res.sendStatus(202);

    },

    //API34
    removeBucketList : async (req,res) => {
        const { productId } = req.body;
        
        const output = await UserManager.removeBucketList(req.userNickname, productId);

        return output ? res.sendStatus(200) : res.sendStatus(202);
    }
    
}