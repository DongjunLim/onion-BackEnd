const HistoryManager = require('../../models/History/HistoryManager');

module.exports.historyController = {

    //API21
    getHistoryList: (req,res) => {

        const output = await HistoryManager.getRecentlyHistoryList(req.userNickname);

        return output? res.send(output) : res.sendStatus(202);
    }
}