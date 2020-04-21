const FeedManager = require('../../../models/Feed/FeedManager');


module.exports.thumbnailController  = {

    getPersonalThumbnail : async (req, res) => {
        const personalFeedThumbnailList = await FeedManager.getPersonalRelatedList(req.userNickname);

        return res.send(personalFeedThumbnailList);
    },

    getTimelineThumbnail : (req, res) => {
        const timelineFeedThumbnailList = await FeedManager.getTimelineFeedList(req.userNickname);

        return res.send(timelineFeedThumbnailList);
    },

    getProfileThumbnail : (req, res) => {
        const profileFeedThumbnailList = await FeedManager.getUserFeedList(req.userNickname);

        return res.send(profileFeedThumbnailList);
    },

    getRelativeThumbnail : (req, res) => {
        const RelativeFeedThumbnailList = await FeedManager.getItemBasedFeedList(req.body.feedId);

        return res.send(RelativeFeedThumbnailList);
    }

}