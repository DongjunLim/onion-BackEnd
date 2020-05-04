const UserManager = require("../User/UserManager");
const FeedManager = require("../Feed/FeedManager");
const ProductManager = require("../Product/ProductManager");



class ProfileManager{
    static async getProfileInfo(userNickname){
    	var profileInfo = {};
    	var followUserList = await UserManager.getFollowUserList(userNickname);
    	profileInfo['numOfFollowUser'] = followUserList['user_follow_list'].length;

    	var followerList = await UserManager.getFollowerList(userNickname);
    	profileInfo['numOfFollower'] = followerList['user_follower_list'].length;
    	
    	profileInfo['feedList'] = await FeedManager.getUserFeedList(userNickname);
    	
    	profileInfo['profilePhotoUrl'] = await UserManager.getUserThumbnailUrl(userNickname);
    	
    	return profileInfo;
    }

    static async getMyProfileInfo(userNickname){
    	var profileInfo = {};
    	var followUserList = await UserManager.getFollowUserList(userNickname);
    	profileInfo['numOfFollowUser'] = followUserList['user_follow_list'].length;

    	var followerList = await UserManager.getFollowerList(userNickname);
    	profileInfo['numOfFollower'] = followerList['user_follower_list'].length;
    	
    	profileInfo['feedList'] = await FeedManager.getUserFeedList(userNickname);
    	
    	var bookmarkIndexList = await UserManager.getBookmarkList(userNickname);
    	profileInfo['bookmarkList'] = await FeedManager.getFeedByIndexList(bookmarkIndexList);
    	
    	var bucketIndexList = await UserManager.getBucketList(userNickname);
    	profileInfo['bucketList'] = await ProductManager.getProductByIndexList(bucketIndexList);

    	profileInfo['profilePhotoUrl'] = await UserManager.getUserThumbnailUrl(userNickname);
    	
    	return profileInfo;
    }
}

module.exports = ProfileManager;

/*
Follwer
Following
feedList = [
    feedInfo:
    { 
        feedId,
        feedThumbnailUrl,
        hashtag,
        photoUrl,
        profilePhotoUrl,
        authorNickname,
        content,
        likeCount,
        isLike,
        isFollow
    }
, …]
bookmarkList = [
    feedInfo:
    { 
        feedId,
        feedThumbnailUrl,
        hashtag,
        photoUrl,
        profilePhotoUrl,
        authorNickname,
        content,
        likeCount,
        isLike,
    }
, …]
bucketList = [
    {
        prodcutId,
        brandId,
        productName,
        productCategory,
        productSize,
        productColor,
        productPrice,
        productStock,
        productThumbnailUrl,
        productPageUrl
    }
, …]
profilePhotoUrl

*/