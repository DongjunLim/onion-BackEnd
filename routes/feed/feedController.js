const FeedManager = require('../../models/Feed/FeedManager');
const UserManager = require('../../models/User/UserManager');

module.exports.feedController = {

    createFeed: async (req, res) => {
        const {
            uploadedPhoto,
            feedContent,
            productTag,
            hashTag,
            additionalInfo
        } = req.body.feed;

        const { height, age, gender } = additionalInfo;

        const output = await FeedManager.createFeed(uploadedPhoto, feedContent, productTag, hashTag, height, gender, age);

        return output ? res.sendStatus(201) : res.sendStatus(204);
    },

    updateFeed: (req, res) => {
        const { modifiedContent, feedId } = req.body;

        const output = await FeedManager.updateFeed(feedId, modifiedContent);

        return output ? res.sendStatus(200) : res.sendStatus(204);
    },

    like: (req, res) => {
        const { feedId } = req.body;
        
        const output = await UserManager.like(feedId,req.userNickname);

        return otput ? res.sendStatus(200) : res.sendStatus(204);
        

    },

    cancelLike: (req, res) => {

    },

    postFeed: (req, res) => {

    },

    getReplyList: (req, res) => {

    },

    createReply: (req, res) => {

    },

    deleteReply: (req, res) => {

    },

    getProductTagList: (req, res) => {

    }









}