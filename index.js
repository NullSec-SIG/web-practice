const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 80;
const hostname = process.env.HOSTNAME || '0.0.0.0';

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/hello', (req, res) => {
    res.json({'hello': 'world'});
});

app.listen(port, hostname, () => console.log(`Server started at http://${hostname}:${port}/`));
