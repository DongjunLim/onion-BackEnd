const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

class AuthManager {

    static async checkEmail(userEmail) {
        
    }

    static async checkNickname(userNickname){

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