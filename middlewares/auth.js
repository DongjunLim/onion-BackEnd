const jwt = require('jsonwebtoken');
const AuthManager = require('../models/Auth/AuthManager');


const authMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.query.token;
    const secret = req.app.get('jwt-secret');

    // token does not exist
    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

    req.userEmail = AuthManager.verify(token, secret);
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
