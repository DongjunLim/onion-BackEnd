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

        const result = await UserManager.createUser(
            userEmail,
            userNickname,
            userPassword,
            userGender,
            userAge,
            userHeight,
            userAddress1,
            userAddress2,
            userInstagramUrl
        );

        return result ? res.sendStatus(201) : res.sendStatus(204);
    }
}