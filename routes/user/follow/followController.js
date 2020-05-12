const UserManager = require('../../../models/User/UserManager');


module.exports.followController = {
    //API28
    getFollowerList: async (req, res) => {

        const output = await UserManager.getFollowerList(req.userNickname);

        return output ? res.send(output) : res.sendStatus(202);
    },

    //API29
    getFollowUserList: async (req, res) => {
        
        const output = await UserManager.getFollowUserList(req.userNickname);

        return output ? res.send(output) : res.sendStatus(202);

    },

    //API30
    addFollowUser: async (req, res) => {
        const { targetNickname } = req.body;
        console.log(targetNickname)
        console.log(req.userNickname)

        const output = await UserManager.follow(req.userNickname,targetNickname)

        return output ? res.sendStatus(201) : res.sendStatus(202);
    },

    //API31
    removeFollowUser: async (req, res) => {
        const { targetNickname } = req.query;
        console.log(targetNickname)
        console.log(req.userNickname)

        const output = await UserManager.unFollow(req.userNickname, targetNickname);

        return output ? res.sendStatus(200) : res.sendStatus(202);

    }
}