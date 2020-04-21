const AuthManager = require('../../models/Auth/AuthManager');
const UserManager = require('../../models/User/UserManager');


module.exports.accountController = {

    //API1
    checkEmail: (req, res) => {
        const { userEmail } = req.body;

        return AuthManager.checkEmail(userEmail) ? res.sendStatus(200) : res.sendStatus(202);
    },

    //API2
    checkNickname: (req, res) => {
        const { userNickname } = req.body;

        return AuthManager.checkNickname(userNickname) ? res.sendStatus(200) : res.sendStatus(202);
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

        userPassword = await AuthManager.encryptPassword(userPassword);

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