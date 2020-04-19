const jwt = require('jsonwebtoken');


class AuthManager {

    async verify(token, secret) {
        const userInfo;
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

    async sign(userEmail, secret) {
        const token = await jwt.sign({ user_email: userEmail }, secret, { expiresIn: '14d' });
        return token;
    }
}


module.exports = AuthManager;