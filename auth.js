const jwt = require('jsonwebtoken');

module.exports = {
    generateAccessToken,
    authenticateToken,
    validateToken,
    removeToken,
    cookieExtractor
}

const secret = process.env.TOKEN_SECRET || "123456"

function generateAccessToken(username) {
    return jwt.sign({ username: username }, secret, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
    const token = cookieExtractor(req);
    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, secret, (err, user) => {
        if (err) {
            removeToken(req, res);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    })
}

function validateToken(req, res, next) {
    const token = cookieExtractor(req);
    if (token) {
        jwt.verify(token, secret, (err, user) => {
            console.log(err, user);
            if (err) {
                removeToken(req, res);
                req.tokenStatus = false;
            }
            req.tokenStatus = true;
            next();
        });
    } else {
        req.tokenStatus = false;
        next();
    }
}

function removeToken(req, res) {
    if (req && req.cookies) {
        res.clearCookie('token');
    }
}

function cookieExtractor(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};
