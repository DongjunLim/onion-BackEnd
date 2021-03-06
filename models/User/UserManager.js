const USER_AUTH_INFO_HANDLER = require("../../schemas/USER_AUTH_INFO");
const USER_DETAIL_INFO_HANDLER = require("../../schemas/USER_DETAIL_INFO");
const AuthManager = require("../Auth/AuthManager");
const AWS = require('aws-sdk');
const s3Account = require("../../s3Account.json");
const crypto = require("crypto");
const fs = require('fs');
const { lstatSync, readdirSync } = require('fs')

class UserManager{
    //유저를 생성하는 메소드
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
        user_detail_info_handler.user_Instagram_url = userInstagramUrl;

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

    //계정을 삭제하는 메소드
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

    //계정 정보를 보내는 메소드
    static async sendAllUserDetailInfo(){
        var queryResult =  await USER_DETAIL_INFO_HANDLER.find({}).sort({
            created_at : -1 //내림차순, Newest to Oldest
        })

        return queryResult ? queryResult : false;
    }

    //유저가 올린 게시글 썸네일을 반환하는 메소드
    static async getUserThumbnailUrl(userNickname){
        //결과 양식 : string
        var queryResult =  await USER_DETAIL_INFO_HANDLER.find({'user_nickname': userNickname}).select('user_profilephoto_url -_id')
        .then(function(result) {
            console.log("테스트:",result)
            return result[0]['user_profilephoto_url'];
        }).catch(function(error){
            console.log(error);
            return undefined;
        })

        return queryResult;
    }

    //유저의 활동을 추가하는 메소드
    static async addActivity(userNickname, feedId){
        var returnResult = {}
        
        returnResult['user_activity_list'] = await USER_DETAIL_INFO_HANDLER.find({'user_nickname': userNickname}).select('user_activity_list -_id')
        .then(function(result) {
            var activityList = result[0]['user_activity_list'];
            activityList.push(feedId);
            return activityList;
        }).catch(function(error){
            console.log(error);
            return false;
        });

        var check = await USER_DETAIL_INFO_HANDLER.updateOne({ 'user_nickname': userNickname }, { 
            user_activity_list: returnResult['user_activity_list'],
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

    //유저의 활동을 반환하는 메소드
    static async getUserActivityList(userNickname){
        var returnResult = {}
        
        returnResult['user_activity_list'] = await USER_DETAIL_INFO_HANDLER.find({'user_nickname': userNickname}).select('user_activity_list -_id')
        .then(function(result) {
            console.log(result);
            return result[0]['user_activity_list'];
        }).catch(function(error){
            console.log(error);
            return false;
        });

        return returnResult['user_activity_list'];
    }

    //유저의 팔로우를 반환하는 메소드
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

    //팔로우 여부를 확인하는 메소드
    static async isFollow(userNickname, callback){

        let result = await USER_DETAIL_INFO_HANDLER.findOne({'user_nickname': userNickname}).select('user_follow_list -_id')
        .then(function(result) {
            callback(result['user_follow_list']);
        }).catch(error=>{
            console.log(error);
            callback(false)
        })

        return;
    }

    //유저의 팔로워를 반환하는 메소드
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

    //프로필을 갱신하는 메소드
    static async updateProfile(userNickname, userHeight, userAge, userAddress1, userAddress2, userInstagramUrl){
        //updateOne 출력양식 : { n: 1, nModified: 1, ok: 1 }

        var check = await USER_DETAIL_INFO_HANDLER.updateOne({ 'user_nickname': userNickname }, { 
            
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

    //프로필 사진을 업로드하는 메소드
    static async uploadProfilePhoto(userNickname, userProfilePhoto){
        var tempUrl = 'profile/' + userProfilePhoto;
        var photoContent = await fs.readFileSync(tempUrl);
        var uploadedProfileUrl = 'profile/' + userNickname;

        var s3 = new AWS.S3({
            accessKeyId: s3Account.AWS_ACCESS_KEY,
            secretAccessKey: s3Account.AWS_SECRET_ACCESS_KEY,
            region : 'ap-northeast-2'
        })

        var paramForS3_profile = {
            'Bucket':'onionphotostorage',
            'Key' : uploadedProfileUrl, // '저장될 경로/파일이름' ex. /image/logo -> image 폴더에 logo.png로 저장됨. 
            'ACL':'public-read',
            'Body': photoContent,
            'ContentType':'image/png'
        }

        await s3.upload(paramForS3_profile, function(err, data){
            if (err){
                console.log(err);
            }
            console.log(data);
        });

        var check = await USER_DETAIL_INFO_HANDLER.updateOne({ 'user_nickname': userNickname }, { 
            user_profilephoto_url: uploadedProfileUrl,
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

    //팔로우하는 메소드
    static async follow(userNickname, followedUserNickname){
        var check1 = await USER_DETAIL_INFO_HANDLER.updateOne({ 'user_nickname': userNickname }, { $push: { user_follow_list : followedUserNickname } })
        .then(function(result) {
            if(result['nModified'] !=0){
                return true;
            }
        }).catch(function(error){
            console.log(error);
            return false;
        });

        var check2 = await USER_DETAIL_INFO_HANDLER.updateOne({ 'user_nickname': followedUserNickname }, { $push: { user_follower_list : userNickname } })
        .then(function(result) {
            if(result['nModified'] !=0){
                return true;
            }
            return false;
        }).catch(function(error){
            console.log(error);
            return false;
        });
        console.log("DONE")
        console.log(check1)
        console.log(check2)
        return check1 && check2;
    }

    //언팔로우하는 메소드
    static async unFollow(userNickname, unfollowedUserNickname){
        var check1 = await USER_DETAIL_INFO_HANDLER.updateOne({ 'user_nickname': userNickname }, { $pull: { user_follow_list : unfollowedUserNickname } })
        .then(function(result) {
            if(result['nModified'] !=0){
                return true;
            }
        }).catch(function(error){
            console.log(error);
            return false;
        });

        var check2 = await USER_DETAIL_INFO_HANDLER.updateOne({ 'user_nickname': unfollowedUserNickname }, { $pull: { user_follower_list : userNickname } })
        .then(function(result) {
            if(result['nModified'] !=0){
                return true;
            }
            return false;
        }).catch(function(error){
            console.log(error);
            return false;
        });
        console.log("DONE")
        console.log(check1)
        console.log(check2)
        return check1 && check2;
    }

    //북마크에 게시글을 추가하는 메소드
    static async addBookmark(feedId){
        var check = await USER_DETAIL_INFO_HANDLER.updateOne({ 'user_nickname': userNickname }, { $push: { user_bookmark_list : feedId } })
        .then(function(result) {
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

    //북마크를 제거하는 메소드
    static async removeBookmark(feedId){
        var check = await USER_DETAIL_INFO_HANDLER.updateOne({ 'user_nickname': userNickname }, { $pull: { user_bookmark_list : feedId } })
        .then(function(result) {
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

    //북마크를 불러오는 메소드
    static async getBookmarkList(userNickname){
        var queryResult =  await USER_DETAIL_INFO_HANDLER.find({'user_nickname': userNickname}).select('user_bookmark_list -_id')
        .then(function(result) {
            return result[0]['user_bookmark_list'];
        }).catch(function(error){
            console.log(error);
            return false;
        })
 
        return queryResult;
    }

    static async like(feedId){
    }

    static async deleteLike(feedId){
    }

    //상품을 장바구니로 옮기는 메소드
    static async addToBucketList(productId){
        var check = await USER_DETAIL_INFO_HANDLER.updateOne({ 'user_nickname': userNickname }, { $push: { user_bucket_list : productId } })
        .then(function(result) {
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

    //장바구니를 가져오는 메소드
    static async getBucketList(userNickname){
        var queryResult =  await USER_DETAIL_INFO_HANDLER.find({'user_nickname': userNickname}).select('user_bucket_list -_id')
        .then(function(result) {
            return result[0]['user_bucket_list'];
        }).catch(function(error){
            console.log(error);
            return false;
        })

        return queryResult;
    }


    static async buyProduct(productId){

    }

    //장바구니의 상품을 구매하는 메소드
    static async buyProductInBucketList(productId){
        var check = await USER_DETAIL_INFO_HANDLER.updateOne({ 'user_nickname': userNickname }, { $pull: { user_bucket_list : productId } })
        .then(function(result) {
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

    //유저 정보를 가져오는 메소드
    static async getUser(userNickname){
        var userInfo;
        await USER_DETAIL_INFO_HANDLER.findOne({user_nickname: userNickname})
        .then((result) => {
            userInfo = result;
        }).catch((error) => {
            console.log(error);
            return false;
        })

        return userInfo;
    }
}


module.exports = UserManager;