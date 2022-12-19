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

        async function f() {
            const { Configuration, OpenAIApi } = require("openai");
            const configuration = new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            });
            const openai = new OpenAIApi(configuration);
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: body.prompt,
                max_tokens: 20,
                temperature: 0,
            });
            try {
                console.log(response.data.choices[0].text);
                res.write(response);
            } catch (err) {
                console.log(err);
            }

        }
        f();
        res.write('<br>END');
        res.end();
    });
}).listen(3000);