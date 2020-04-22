const HistoryManager = require('../../models/History/HistoryManager');

module.exports.historyController = {

    //API21
    getHistoryList: async (req,res) => {

        const output = await HistoryManager.getRecentlyHistoryList(req.userNickname);

        return output? res.send(output) : res.sendStatus(202);
    }
}