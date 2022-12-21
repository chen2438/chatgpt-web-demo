var http = require('http');
var querystring = require('querystring');
// var he = require('he');

http.createServer(function (req, res) {
    var body = "";
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        body = querystring.parse(body);
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf8', 'Access-Control-Allow-Origin': '*'
        });
        async function f() {
            console.log(body.prompt);
            const { Configuration, OpenAIApi } = require("openai");
            const configuration = new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            });
            const openai = new OpenAIApi(configuration);
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: body.prompt,
                max_tokens: Number(body.max_tokens),
                temperature: Number(body.temperature),
            });
            try {
                console.log(response.data);
                res.write(JSON.stringify(response.data));
                res.end();
            } catch (err) {
                console.log(err);
            }
        }
        f();
    });
}).listen(3000);

console.log("Running in port 3000.")