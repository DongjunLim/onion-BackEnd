const AuthManager = require('../../models/Auth/AuthManager');
const UserManager = require('../../models/User/UserManager');


module.exports.accountController = {

    //API1
    checkEmail: async (req, res) => {
        const { userEmail } = req.query;

        return await AuthManager.checkEmail(userEmail) ? res.sendStatus(200) : res.sendStatus(202);
    },

    //API2
    checkNickname: async (req, res) => {
        const { userNickname } = req.query;

        return await AuthManager.checkNickname(userNickname) ? res.sendStatus(200) : res.sendStatus(202);
    },

    //API3
    register: async (req, res) => {
        const secret = req.app.get('jwt-secret');
        const {
            userEmail,
            userNickname,
            userPassword,
            userGender,
            userAge,
            userHeight,
            userAddress1,
            userAddress2,
            userInstagramUrl
        } = req.body;
        
        var encryptedPassword = await AuthManager.encryptPassword(userPassword);

        await UserManager.createUser(
            userEmail,
            userNickname,
            encryptedPassword,
            userGender,
            userAge,
            userHeight,
            userAddress1,
            userAddress2,
            userInstagramUrl, secret, async (result) => {
                if (result){
                    const token = await AuthManager.sign(userEmail,userNickname,encryptedPassword);
                    const jsonBody = { token: token}
                    res.statusCode = 201;
                    return res.send(jsonBody);
                } else
                    res.sendStatus(204);
                
            }
        );

    }
}