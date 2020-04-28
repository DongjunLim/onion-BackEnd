const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const USER_AUTH_INFO_HANDLER = require("../../schemas/USER_AUTH_INFO");

class AuthManager{
    static async checkEmail(userEmail) {
        //return NULL or data
        var queryResult = await USER_AUTH_INFO_HANDLER.findOne({
            user_email: userEmail
        }).exec();
        console.log(queryResult);
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

    static async login(inputEmail,inputPassword,secretKey){
        var token;
        var userInfo = await USER_AUTH_INFO_HANDLER.findOne({
            user_email: inputEmail
        }).exec();

        const { user_email, user_nickname,user_password} = userInfo;

        await bcrypt.compare(inputPassword,user_password, async (err, res) => {
            if (err) { throw err;}
            if (res){
                token = await this.sign(user_email,user_nickname,secretKey);
            }
        });

        return token;
    }
}

// 테스트할때 필요한 토큰을 일시 발급하는 테스트코드
// foo = async () => {
//     const token = await AuthManager.sign("armada55","dongjun","secret");
//     console.log(token);
// }
// foo();


module.exports = AuthManager;