var http = require('http');
var querystring = require('querystring');

http.createServer(function (req, res) {
    var body = "";
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        body = querystring.parse(body);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        if (body.username) {
            res.write(body.username);
            res.write('<br>success');
        }
        res.end();
    });
}).listen(3000);