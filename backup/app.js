const express = require('express');
const app = express();

// Must match up with /etc/nginx/frameworks-available/nodejs.conf!
const port = 8081;

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// Required for running behind nginx
app.set('trust proxy', 'loopback');

app.get('/', function (req, res) {
   res.send('Hello again and again');
});

app.get('/test', function (req, res) {
   res.send('New endpoint');
});