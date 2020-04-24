const AuthManager = require('../../models/Auth/AuthManager');

module.exports.loginController = {

    //API16
    loginVerification: async (req, res) => {
        const secret = req.app.get('jwt-secret');
        const inputEmail = req.headers['userEmail'];
        const inputPassword = req.headers['userPassword'];

        const token = await AuthManager.login(inputEmail,inputPassword, secret);

        return token ? res.send(token) : res.sendStatus(202);
    },

    //API17
    socialLoginVerification: (req, res) => {
        
    }

}

