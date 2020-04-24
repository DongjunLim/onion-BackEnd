const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const USER_AUTH_INFO_HANDLER = require("../../schemas/USER_AUTH_INFO");

class AuthManager{
    static async checkEmail(userEmail) {
        //return NULL or data
        var queryResult = await USER_AUTH_INFO_HANDLER.findOne({
            user_email: userEmail
        }).exec();
        return queryResult ? true : false;
    }

    static async checkNickname(userNickname){
        //return NULL or data
        var queryResult = await USER_AUTH_INFO_HANDLER.findOne({
            user_nickname: userNickname
        }).exec();
        return queryResult ? true : false;
    }

    static async encryptPassword(password){
        let userPassword
        await bcrypt.hash(password, null, null, (err, hash) => {
            if (err) { throw err; }
            userPassword = hash;
        });
        return userPassword;
    }

    static async verify(token, secret) {
        let userInfo;
        await jwt.verify(token, secret, (err, decoded) => {
            if (err) { throw err; };  //에러 핸들링 로직 작성해야함
            userInfo = {
                userEmail: decoded.user_email,
                userNickname: decoded.user_nickname
            };
        });
        return userInfo;
    }

    static async sign(userEmail, userNickname,secret) {
        const token = await jwt.sign({ user_email: userEmail, user_nickname : userNickname }, secret, { expiresIn: '14d' });
        return token;
    }

    static async login(userEmail,userPassword,secretKey){
        var user_auth_handler = new USER_AUTH_INFO_HANDLER();
        


    }
}


module.exports = AuthManager;