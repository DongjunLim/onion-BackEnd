const USER_DETAIL_INFO = require('../../schemas/USER_DETAIL_INFO');

class HistoryManager{
    //기록을 추가하는 메소드
    static async addHistory(userNickname, historyObj){
        const doc = await USER_DETAIL_INFO.findOne({user_nickname:userNickname});
        await doc.user_history_list.push(historyObj);
        await doc.save((err)=>{
            if(err){
                console.log(err);
                return false;
            }
            return true;
        })
    }

    //팔로우 기록을 추가하는 메소드
    static async addFollowHistory(userNickname, followerNickname){
        const historyDoc = {
            'type': 'follow',
            'follower' : followerNickname,
            'profileUrl' : 'profile/' + followerNickname,
            'created_at' : Date.now()
        }

        const result = await this.addHistory(userNickname,historyDoc);

        return result ? true : false;
    }

    //답글 기록을 추가하는 메소드
    static async addReplyHistory(userNickname, feedId, writerNickname, comment){
        const historyDoc = {
            'type': 'reply',
            'feedId':feedId,
            'writer': writerNickname,
            'comment':comment,
            'profileUrl' : 'profile/' +  writerNickname,
            'created_at' : Date.now()
        }

        const result = await this.addHistory(userNickname,historyDoc);

        return result ? true : false;
    }

    //좋아요 기록을 추가하는 메소드
    static async addLikeHistory(userNickname, feedId, likeCount){
        const historyDoc = {
            'type': 'like',
            'feedId':feedId,
            'likeCount': likeCount,
            'created_at' : Date.now()
        }

        const result = await this.addHistory(userNickname,historyDoc);

        return result ? true : false;
    }

    //최근 기록을 반환하는 메소드
    static async getRecentlyHistoryList(userNickname, callback){
        console.log("닉네임: " + userNickname);
        await USER_DETAIL_INFO.findOne({user_nickname:userNickname}).select('user_history_list -_id').sort({
            created_at : 1 //오름차순, Oldest to Newest
            
        }).then(result => {
            callback(result);
        })
    }
}

module.exports = HistoryManager;