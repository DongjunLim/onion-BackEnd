const FeedManager = require('../../../models/Feed/FeedManager');


module.exports.thumbnailController  = {

    //API12
    getPersonalThumbnail : async (req, res) => {
        const personalFeedThumbnailList = await FeedManager.getPersonalRelatedList(req.userNickname);

        return res.send(personalFeedThumbnailList);
    },

    //API13
    getTimelineThumbnail : async (req, res) => {
        const timelineFeedThumbnailList = await FeedManager.getTimelineFeedList(req.userNickname);

        return res.send(timelineFeedThumbnailList);
    },

    //API14
    getProfileThumbnail : async (req, res) => {
        const profileFeedThumbnailList = await FeedManager.getUserFeedList(req.userNickname);

        return res.send(profileFeedThumbnailList);
    },

    //API15
    getRelativeThumbnail : async (req, res) => {
        const { feedId } = req.params;

        const RelativeFeedThumbnailList = await FeedManager.getItemBasedFeedList(feedId);

        return res.send(RelativeFeedThumbnailList);
    }

}