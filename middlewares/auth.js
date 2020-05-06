const jwt = require('jsonwebtoken');
const AuthManager = require('../models/Auth/AuthManager');


const authMiddleware = async (req, res, next) => {
    // const secret = req.app.get('jwt-secret');
    const secret = "onionJWTsEcRITKEYforHaSHing";
    const token = req.headers['authorization'];
    console.log(req);
    console.log(token);
    // token does not exist
    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

    const userInfo = await AuthManager.verify(token,secret);

    req.userEmail = userInfo.userEmail;
    req.userNickname = userInfo.userNickname;

    if(req.userEmail){
        next();
    } else{
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }
}

module.exports = authMiddleware;
