const USER_AUTH_INFO_HANDLER = require("../../schemas/USER_AUTH_INFO");
const USER_DETAIL_INFO_HANDLER = require("../../schemas/USER_DETAIL_INFO");
const AuthManager = require("../Auth/AuthManager");
const AWS = require('aws-sdk');
const s3Account = require("../../s3Account.json");
const crypto = require("crypto");

class UserManager{
    static async createUser(userEmail, userNickname, userPassword, userGender, userAge, userHeight, userAddress1, userAddress2, userInstagramIUrl ,secret,callback){
        var user_auth_info_handler = new USER_AUTH_INFO_HANDLER();
        var user_detail_info_handler = new USER_DETAIL_INFO_HANDLER();

        user_auth_info_handler.user_email = userEmail;
        user_auth_info_handler.user_nickname = userNickname;
        user_auth_info_handler.user_password = userPassword;

        user_detail_info_handler.user_nickname = userNickname;
        user_detail_info_handler.user_gender = userGender;
        user_detail_info_handler.user_height = userHeight;
        user_detail_info_handler.user_age = userAge;
        user_detail_info_handler.user_address.address1 = userAddress1;
        user_detail_info_handler.user_address.address2 = userAddress2;
        user_detail_info_handler.user_Instagram_url = userInstagramIUrl;

        await user_auth_info_handler.save(function(err){
            if(err){
                console.log(err);
                callback(false);
            }
        });

        await user_detail_info_handler.save( async (err) => {
            if(err){
                console.log(err);
                callback(false)
            }
            else{
                callback(true);
            }
        });
        return;
    }

    static async initUserObject(userNickname){
    }

    static async deleteUser(userNickname){
        await USER_AUTH_INFO_HANDLER.deleteOne({ 'user_nickname': userNickname }, function(err){
            if(err){
                console.log(err);
            }
        })

        await USER_DETAIL_INFO_HANDLER.deleteOne({ 'user_nickname': userNickname }, function(err){
            if(err){
                console.log(err);
                return false;
            }
            return true
        })
    }

    static async getFollowUserList(userNickname){
        //팔로우 유저 썸네일 url도 같이 리턴할 방안 구상하기
        var queryResult =  await USER_DETAIL_INFO_HANDLER.find({'user_nickname': userNickname}).select('user_follow_list -_id')

        return queryResult ? queryResult : false;
    }

    static async getFollowerList(userNickname){
        //팔로우 유저 썸네일 url도 같이 리턴할 방안 구상하기
        var queryResult =  await USER_DETAIL_INFO_HANDLER.find({'user_nickname': userNickname}).select('user_follower_list -_id')

        return queryResult ? queryResult : false;
    }

    static async updateProfile(userNickname, userGender, userHeight, userAge, userAddress1, userAddress2, userInstagramUrl){
        await USER_DETAIL_INFO_HANDLER.updateOne({ 'user_nickname': userNickname }, { 
            user_gender: userGender,
            user_height: userHeight,
            user_age: userAge,
            // user_address.address1: userAddress1,
            // user_address.address2: userAddress2,
            user_Instagram_url: userInstagramUrl,
            updated_at: Date.now()
        }, function(err){
            if(err){
                console.log(err);
                return false;
            }
            return true
        })
    }

    static async uploadProfilePhoto(userNickname, userProfilePhoto){
        var file_name = crypto.randomBytes(20).toString('hex');
        var uploadedProfileUrl = 'profile/' + file_name;

        var s3 = new AWS.S3({
            accessKeyId: s3Account.AWS_ACCESS_KEY,
            secretAccessKey: s3Account.AWS_SECRET_ACCESS_KEY,
            region : 'ap-northeast-2'
        })

        var paramForS3_profile = {
            'Bucket':'onionphotostorage',
            'Key' : uploadedProfileUrl, // '저장될 경로/파일이름' ex. /image/logo -> image 폴더에 logo.png로 저장됨. 
            'ACL':'public-read',
            'Body': userProfilePhoto,
            'ContentType':'image/png'
        }

        await s3.upload(paramForS3_profile, function(err, data){
            if (err){
                console.log(err);
            }
            console.log(data);
        });

        await USER_DETAIL_INFO_HANDLER.updateOne({ 'user_nickname': userNickname }, { 
            user_profilephoto_url: uploadedProfileUrl,
            updated_at: Date.now()
        }, function(err){
            if(err){
                console.log(err);
                return false;
            }
            return true
        })
    }

    static async follow(userNickname, followedUserNickname){
        
    }

    static async unFollow(userNickname, unfollowedUserNickname){
    }

    static async addBookmark(feedId){
    }

    static async removeBookmark(feedId){
    }

    static async like(feedId){
    }

    static async deleteLike(feedId){
    }

    static async addToBucketList(productId){
    }

    static async buyProduct(productId){
    }

    static async buyProductInBucketList(productId){
    }
}

module.exports = UserManager;