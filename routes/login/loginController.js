const AuthManager = require('../../models/Auth/AuthManager');

module.exports.loginController = {

    //API16
    loginVerification: async (req, res) => {
        const secret = req.app.get('jwt-secret');
        const inputEmail = req.headers['useremail'];
        const inputPassword = req.headers['userpassword'];


        const token = await AuthManager.login(inputEmail,inputPassword, secret, (token) => {
            const body = { token:token }
            return token ? res.send(body) : res.sendStatus(202);
        });
        return;
    },

    //API17
    socialLoginVerification: (req, res) => {
        
    }

}

