const UserManager = require('../../models/UserManager');


module.exports.registerController = {
    checkEmail: (req, res) => {
        var { userEmail } = req.body;

        userManager = new UserManager();
        
        return userManager.checkEmail() ? res.sendStatus(200)  : res.sendStatus(204) ;
    },
}