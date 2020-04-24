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

    }

    static async verify(token, secret) {
        let userInfo;
        const p = new Promise(
            (resolve, reject) => {
                jwt.verify(token, secret, (err, decoded) => {
                    if (err) reject(err)
                    resolve(decoded)
                })
            }
        ).then((decoded) => {
            userInfo = decoded;
        }).catch(onError);
        return userInfo;
    }

    static async sign(userEmail, secret) {
        const token = await jwt.sign({ user_email: userEmail }, secret, { expiresIn: '14d' });
        return token;
    }
}


module.exports = AuthManager;