const UserManager = require('../../../models/Profile/ProfileManager');

module.exports.bookmarkController = {
    
    //설계서에 메소드 누락. 
    //API22
    getBookmarkFeedList : async (req,res) => {

    },

    //API23
    addBookmark : async (req,res) => {

        const { feedId } = req.body;

        const output = await UserManager.addBookmark(req.userNickname, feedId);

        return output ? res.sendStatus(201) : res.sendStatus(202);

    },

    //API24
    removeBookmark : async (req,res) => {

        const { feedId } = req.body;

        const output = await UserManager.removeBookmark(req.userNickname, feedId);

        return output ? res.sendStatus(200) : res.sendStatus(202);

    }
}