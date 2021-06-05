const path = require('path');
const express = require('express');
const cookierParser = require('cookie-parser');
const api = require('./api')
const auth = require('./auth')

const app = express();
const port = process.env.PORT || 8080;
const hostname = process.env.HOSTNAME || '127.0.0.1';

app.disable('etag');

app.use(express.urlencoded());
app.use(express.json());
app.use(cookierParser('abcdef-12345'))
app.use(express.static(path.join(__dirname, '/public')));

app.get('/*', function(req, res, next){ 
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next(); 
});
app.get('/', api.showHtml('public/index.html'));
app.get('/hello', api.helloWorld);
app.get('/register', api.showHtml('public/register.html'));
app.get('/login', auth.validateToken, api.checkLoggedIn, api.showHtml('public/login.html'));
app.post('/login', api.login);
app.get('/success', auth.authenticateToken,api.showHtml('public/success.html'));
app.post('/logout', api.logout);
app.get('/secret', auth.authenticateToken, api.showHtml('public/secret.html'));

app.listen(port, hostname, () => console.log(`Server started at http://${hostname}:${port}/`));
