const FeedManager = require('../../../models/Feed/FeedManager');
const UserManager = require('../../../models/User/UserManager');
const ProfileManager = require('../../../models/Profile/ProfileManager');


module.exports.thumbnailController  = {

    //API12
    getPersonalThumbnail : async (req, res) => {
        const personalFeedThumbnailList = await FeedManager.getPersonalRelatedList(req.userNickname);
        var responseDataList = [];
        await personalFeedThumbnailList.forEach((element)=>{
            const responseData = {
                feedId: element['id'],
                hashTag: element['feed_hashtag'],
                profileUrl: element['author_profile_photo'],
                profilePhotoUrl: element['author_profile_photo'],
                photoUrl: element['feed_photo_url'],
                feedThumbnailUrl: element['feed_thumbnail_url'],
                authorNickname: element['feed_user_nickname'], 
                content: element['feed_content'],  
                likeCount : 4,
                isLike: true,
                isFollow: true           
            }

            responseDataList.push(responseData);
        })
        
        const resData = {
            feedList: responseDataList
        }

        


        return res.send(resData);
    },
    getKeywordThumbnail : async (req, res) => {
        var { keyword } = req.query;
        const responseDataList = [];
        const feedList = await FeedManager.getKeywordFeedList(keyword);

        await feedList.forEach((element)=>{
            const responseData = {
                feedId: element['id'],
                hashTag: element['feed_hashtag'],
                profileUrl: element['author_profile_photo'],
                profilePhotoUrl: element['author_profile_photo'],
                photoUrl: element['feed_photo_url'],
                feedThumbnailUrl: element['feed_thumbnail_url'],
                authorNickname: element['feed_user_nickname'], 
                content: element['feed_content'],  
                likeCount : 4,
                isLike: true,
                isFollow: true           
            }

            responseDataList.push(responseData);
        })
        
        const resData = {
            feedList: responseDataList
        }

        console.log(resData)

        return res.send(resData);
    }
    ,

    //API13
    getTimelineThumbnail : async (req, res) => {
        const timelineFeedThumbnailList = await FeedManager.getTimelineFeedList(req.userNickname);

        var responseDataList = [];
        await timelineFeedThumbnailList.forEach((element)=>{
            const responseData = {
                feedId: element['id'],
                hashTag: element['feed_hashtag'],
                profileUrl: element['author_profile_photo'],
                profilePhotoUrl: element['author_profile_photo'],
                photoUrl: element['feed_photo_url'],
                feedThumbnailUrl: element['feed_thumbnail_url'],
                authorNickname: element['feed_user_nickname'], 
                content: element['feed_content'],  
                likeCount : 4,
                isLike: true,
                isFollow: true    
            }

            responseDataList.push(responseData);
        })
        
        const resData = {
            feedList: responseDataList
        }
        return res.send(resData);

    },

    //API14
    getProfileThumbnail : async (req, res) => {
        const profileFeedThumbnailList = await FeedManager.getUserFeedList(req.userNickname);

        var responseDataList = [];
        await profileFeedThumbnailList.forEach((element)=>{
            const responseData = {
                feedId: element['id'],
                hashTag: element['feed_hashtag'],
                profileUrl: element['author_profile_photo'],
                profilePhotoUrl: element['author_profile_photo'],
                photoUrl: element['feed_photo_url'],
                feedThumbnailUrl: element['feed_thumbnail_url'],
                authorNickname: element['feed_user_nickname'], 
                content: element['feed_content'],  
                likeCount : 4,
                isLike: true,
                isFollow: true           
            }
            responseDataList.push(responseData);
        })
        
        const resData = {
            feedList: responseDataList
        }
        console.log(resData);
        return res.send(resData);
    },

    //API15
    getRelativeThumbnail : async (req, res) => {
        const { feedId } = req.query;

        const RelativeFeedThumbnailList = await FeedManager.getItemBasedFeedList(feedId);
        console.log(RelativeFeedThumbnailList)
        var responseDataList = [];
        await RelativeFeedThumbnailList.forEach((element)=>{
            const responseData = {
                feedId: element['id'],
                hashTag: element['feed_hashtag'],
                profileUrl: element['author_profile_photo'],
                profilePhotoUrl: element['author_profile_photo'],
                photoUrl: element['feed_photo_url'],
                feedThumbnailUrl: element['feed_thumbnail_url'],
                authorNickname: element['feed_user_nickname'], 
                content: element['feed_content'],  
                likeCount : 4,
                isLike: true,
                isFollow: false,
            }


            responseDataList.push(responseData);
        })
        const resData = {
            feedList: responseDataList
        }
        return res.send(resData);
    },

    getBookmarkThumbnail : async (req, res) => {
        const bookmarkList = await UserManager.getBookmarkList(req.userNickname);
        const bookmarkFeedThumbnailList = await FeedManager.getFeedByIndexList(bookmarkList);
        var responseDataList = [];
        await bookmarkFeedThumbnailList.forEach((element)=>{
            const responseData = {
                feedId: element['id'],
                hashTag: element['feed_hashtag'],
                profileUrl: element['author_profile_photo'],
                profilePhotoUrl: element['author_profile_photo'],
                photoUrl: element['feed_photo_url'],
                feedThumbnailUrl: element['feed_thumbnail_url'],
                authorNickname: element['feed_user_nickname'], 
                content: element['feed_content'],  
                likeCount : 4,
                isLike: true,
                isFollow: true           
            }
            responseDataList.push(responseData);
        })
        
        const resData = {
            feedList: responseDataList
        }
        console.log(resData);
        return res.send(resData);
    }

}