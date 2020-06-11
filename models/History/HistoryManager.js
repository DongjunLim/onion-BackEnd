const USER_DETAIL_INFO = require('../../schemas/USER_DETAIL_INFO');

class HistoryManager{
    async addHistory(userNickname, historyObj){
        const doc = await USER_DETAIL_INFO.findOne({_id:userNickname});
        await doc.user_history_list.push(historyObj);
        await doc.save((err)=>{
            if(err){
                console.log(err);
                return false;
            }
            return true;
        })
    }

    static async addFollowHistory(userNickname, followerNickname){
        const historyDoc = {
            'type': 'follow',
            'follower' : followerNickname,
            'profileUrl' : 'photoUrl/' + followerNickname,
            'created_at' : Date.now()
        }

        const result = await this.addHistory(userNickname,historyDoc);

        return result ? true : false;
    }

    static async addReplyHistory(userNickname, feedId, writerNickname, comment){
        const historyDoc = {
            'type': 'reply',
            'feedId':feedId,
            'writer': writerNickname,
            'comment':comment,
            'profileUrl' : 'photoUrl/' +  writerNickname,
            'created_at' : Date.now()
        }

        const result = await this.addHistory(userNickname,historyDoc);

        return result ? true : false;
    }

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

    static async getRecentlyHistoryList(userNickname){
        var historyList =  await USER_DETAIL_INFO.findOne({user_nickname:userNickname}).select('user_history_list -_id').sort({
            created_at : 1 //오름차순, Oldest to Newest
        })

        return historyList ? historyList : false;
    }
}

module.exports = HistoryManager;