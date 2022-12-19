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
        if (body.prompt) {
            const { Configuration, OpenAIApi } = require("openai");
            const configuration = new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            });
            const openai = new OpenAIApi(configuration);
            const response = openai.createCompletion({
                model: "text-davinci-003",
                prompt: "Say this is a test",
                max_tokens: 7,
                temperature: 0,
            });
            res.write(response);
            res.write('<br>END');
        }
        res.end();
    });
}).listen(3000);