const jwt = require('jsonwebtoken');

module.exports = {
    generateAccessToken,
    authenticateToken,
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
          return res.sendStatus(403);
      }
      req.user = user;
      next();
    })
}

function cookieExtractor(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};
