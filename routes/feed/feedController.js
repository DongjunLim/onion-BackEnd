const FeedManager = require('../../models/Feed/FeedManager');
const UserManager = require('../../models/User/UserManager');

module.exports.feedController = {

    //API4
    createFeed: async (req, res) => {
        const {
            uploadedPhoto,
            feedContent,
            productTag,
            hashTag,
            additionalInfo
        } = req.body.feed;

        const { height, age, gender } = additionalInfo;

        const output = await FeedManager.createFeed(req.userNickname, uploadedPhoto, feedContent, productTag, hashTag, height, gender, age);

        return output ? res.sendStatus(201) : res.sendStatus(204);
    },

    //API5
    updateFeed: async (req, res) => {
        const { modifiedContent, feedId } = req.body;

        const output = await FeedManager.updateFeed(feedId, modifiedContent);

        return output ? res.sendStatus(200) : res.sendStatus(204);
    },

    //API6
    like: async (req, res) => {
        const { feedId } = req.body;
        
        const output = await UserManager.like(req.userNickname,feedId);

        return output ? res.sendStatus(200) : res.sendStatus(202);  
    },

    //API7
    cancelLike: async (req, res) => {
        const { feedId } = req.body;

        const output = await UserManager.deleteLike(req.userNickname,feedId);

        return output ? res.sendStatus(200) : res.sendStatus(202);
    },

    //API8
    getReplyList: async (req, res) => {
        const { feedId } = req.body;

        const output = await FeedManager.getReplyList(feedId);

        return output? res.send(output) : res.sendStatus(202);

    },

    //API9
    createReply: async (req, res) => {
        const { feedId, replyContent } = req.body;

        const output = await FeedManager.createReply(req.userNickname,feedId,replyContent);

        return output ? res.sendStatus(201) : res.sendStatus(202);
    },

    //API10
    deleteReply: async (req, res) => {
        const { feedId, replyId } = req.body;

        const output = await FeedManager.removeReply(feedId,replyId);

        return output ? res.sendStatus(200) : res.sendStatus(202);

    },

    //API11
    getProductTagList: async (req, res) => {
        const { feedId } = req.body;
        
        const output = await FeedManager.getProductTagList(feedId);

        return output ? res.send(output) : res.sendStatus(202);
    }

}