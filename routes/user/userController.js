const UserManager = require('../../models/User/UserManager');


module.exports.userController = {
    
    getUserInfo: async (req,res) => {
        const userInfo = await UserManager.getUser(req.userNickname);
        
        return userInfo ? res.send(userInfo) : res.sendStatus(202);
    }



}