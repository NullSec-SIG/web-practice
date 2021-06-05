const path = require('path');
const auth = require('./auth');

module.exports = {
    showHtml,
    helloWorld,
    checkLoggedIn,
    login,
    logout
}

function showHtml(htmlFile) {
    return (req, res) => {
        res.sendFile(path.join(__dirname, htmlFile));
    }
}

function helloWorld(req, res) {
    res.json({'hello': 'world'});
}

function checkLoggedIn(req, res, next) {
    console.log(req.tokenStatus);
    if (req.tokenStatus) {
        res.writeHead(302, {
            'Location': '/success'
        })
        .send();
    } else {
        next();
    }
}

function login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400);
    }
    console.log(username)
    const token = auth.generateAccessToken(username);
    res.writeHead(302, {
        'Set-Cookie': `token=${token}; HttpOnly`,
        'Access-Control-Allow-Credentials': 'true',
        'Location': '/success'
    })
    .send();
}

function logout(req, res) {
    auth.removeToken(req, res);
    res.writeHead(302, {
        'Location': '/login'
    })
    .send();
}
