const USER_AUTH_INFO_HANDLER = require("../../schemas/USER_AUTH_INFO");
const USER_DETAIL_INFO_HANDLER = require("../../schemas/USER_DETAIL_INFO");
const AuthManager = require("../Auth/AuthManager");
const AWS = require('aws-sdk');
const s3Account = require("../../s3Account.json");
const crypto = require("crypto");

class UserManager{
    static async createUser(userEmail, userNickname, userPassword, userGender, userAge, userHeight, userAddress1, userAddress2, userInstagramUrl, secret){
        var user_auth_info_handler = new USER_AUTH_INFO_HANDLER();
        var user_detail_info_handler = new USER_DETAIL_INFO_HANDLER();

        user_auth_info_handler.user_email = userEmail;
        user_auth_info_handler.user_nickname = userNickname;
        user_auth_info_handler.user_password = userPassword;

        user_detail_info_handler.user_nickname = userNickname;
        user_detail_info_handler.user_gender = userGender;
        user_detail_info_handler.user_height = userHeight;
        user_detail_info_handler.user_age = userAge;
        user_detail_info_handler.user_address = [userAddress1, userAddress2];
        user_detail_info_handler.user_Instagram_url = userInstagramIUrl;

        var check1 = await user_auth_info_handler.save().then(function(result){
            if (result){
                return true;
            }
        })
        .catch(function(error){
            console.log(error);
            return false;
        });

        var check2 = await user_detail_info_handler.save().then()
        .catch(function(error){
            console.log(error);
            return false;
        });

        return check1 && check2;
    }

    static async initUserObject(userNickname){
    }

    static async deleteUser(userNickname){
        //deleteOne 결과양식 : { n: 0, ok: 1, deletedCount: 0 }
        var check1 = await USER_AUTH_INFO_HANDLER.deleteOne({ user_nickname: userNickname })
        .then(function(result) {
            if (result['deletedCount'] != 0){
                return true;
            }
            return false;
        }).catch(function(error){
            console.log(error);
            return false;
        })

        var check2 = await USER_DETAIL_INFO_HANDLER.deleteOne({ user_nickname: userNickname })
        .then(function(result) {
            if (result['deletedCount'] != 0){
                return true;
            }
            return false;
        }).catch(function(error){
            console.log(error);
            return false;
        })

        return check1 && check2;
    }

    static async getUserThumbnailUrl(userNickname){
        //결과 양식 : string
        var queryResult =  await USER_DETAIL_INFO_HANDLER.find({'user_nickname': userNickname}).select('user_profilephoto_url -_id')
        .then(function(result) {
            return result[0]['user_profilephoto_url'];
        }).catch(function(error){
            console.log(error);
            return false;
        })

        return queryResult;
    }

    static async getFollowUserList(userNickname){
        //팔로우 유저 썸네일 url도 같이 리턴
        //결과 양식 : {user_follow_list: ["test0509","test0511"], user_profilephoto_url: [ '0909inst.gram/abc', '11inst.gram/abc' ]}
        var returnResult = {}
        
        returnResult['user_follow_list'] = await USER_DETAIL_INFO_HANDLER.find({'user_nickname': userNickname}).select('user_follow_list -_id')
        .then(function(result) {
            return result[0]['user_follow_list'];
        }).catch(function(error){
            console.log(error);
            return false;
        });

        returnResult['user_profilephoto_url'] = []

        for (const element of returnResult['user_follow_list']){
            var thumb = await UserManager.getUserThumbnailUrl(element);
            returnResult['user_profilephoto_url'].push(thumb);
        }

        return returnResult;
    }

    static async getFollowerList(userNickname){
        //팔로우 유저 썸네일 url도 같이 리턴
        var returnResult = {}
        
        returnResult['user_follower_list'] = await USER_DETAIL_INFO_HANDLER.find({'user_nickname': userNickname}).select('user_follower_list -_id')
        .then(function(result) {
            return result[0]['user_follower_list'];
        }).catch(function(error){
            console.log(error);
            return false;
        });

        returnResult['user_profilephoto_url'] = []

        for (const element of returnResult['user_follower_list']){
            var thumb = await UserManager.getUserThumbnailUrl(element);
            returnResult['user_profilephoto_url'].push(thumb);
        }

        return returnResult;
    }

    static async updateProfile(userNickname, userGender, userHeight, userAge, userAddress1, userAddress2, userInstagramUrl){
        //updateOne 출력양식 : { n: 1, nModified: 1, ok: 1 }

        var check = await USER_DETAIL_INFO_HANDLER.updateOne({ 'user_nickname': userNickname }, { 
            user_gender: userGender,
            user_height: userHeight,
            user_age: userAge,
            user_address: [userAddress1, userAddress2],
            user_Instagram_url: userInstagramUrl,
            updated_at: Date.now()
        }).then(function(result) {
            if(result['nModified'] !=0){
                return true;
            }
            return false;
        }).catch(function(error){
            console.log(error);
            return false;
        });

        return check;
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