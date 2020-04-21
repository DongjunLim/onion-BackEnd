

class UserInfo{
	constructor(userId, userPassword, userProfilePhotoUrl, userInstagramUrl, 
		userFeed, followUserCount, followerCount, userBookmarkList, 
		userBucketList, followUserList, followerList){
		this.userId = userId
		this.userPassword = userPassword
		this.userProfilePhotoUrl = userProfilePhotoUrl
		this.userInstagramUrl = userInstagramUrl

		this.userFeed = userFeed
		this.followUserCount = followUserCount
		this.followerCount = followerCount
		this.userBookmarkList = userBookmarkList

		this.userBucketList = userBucketList
		this.followUserList = followUserList
		this.followerList = followerList
	}
}


module.exports = UserInfo;
