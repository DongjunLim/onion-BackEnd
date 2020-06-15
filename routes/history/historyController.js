const HistoryManager = require('../../models/History/HistoryManager');



module.exports.historyController = {

    //API21
    getHistoryList: async (req,res) => {
        console.log("라우팅: " + req.userNickname);
        await HistoryManager.getRecentlyHistoryList(req.userNickname, result => {
            console.log(result);
            return result? res.send(result) : res.sendStatus(202);
        });

    }
}