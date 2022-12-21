var http = require('http');

http.createServer(function (req, res) {
    req.on('end', function () {
        res.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf8' });
        async function f() {
            const { Configuration, OpenAIApi } = require("openai");
            const configuration = new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            });
            const openai = new OpenAIApi(configuration);
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: "输出:这是一个测试.",
                stream: true,
                max_tokens: 200,
                temperature: 0.7,
            });
            try {
                console.log(response);
                res.write(response);
                res.end();
            } catch (err) {
                console.log(err);
            }
        }
        f();
    });
}).listen(3000);

console.log("Running in port 3000.")