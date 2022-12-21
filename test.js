var http = require('http');
var querystring = require('querystring');

async function getOpenAI(body) {//OpenAI API
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
    // return response.data;
    console.log("返回值:");
    console.log(response.data);
    res.write(JSON.stringify(response.data));
    res.end();
}

http.createServer(function (req, res) {
    var body = "";
    req.on('data', function (chunk) {//接收表单参数
        body += chunk;
    });
    req.on('end', function () {
        body = querystring.parse(body);//解析参数
        console.log("获取到POST参数:");
        console.log(body);
        res.writeHead(200, {//返回json格式, 允许跨域
            'Content-Type': 'application/json; charset=utf8', 'Access-Control-Allow-Origin': '*'
        });
        getOpenAI(body);
    });
}).listen(3000);

console.log("Running in port 3000.")