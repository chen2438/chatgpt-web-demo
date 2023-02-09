var http = require('http');
var querystring = require('querystring');

async function getOpenAI(res, body) {//OpenAI API
    try {
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
        res.writeHead(response.status, {//返回json格式, 允许跨域
            'Content-Type': 'application/json; charset=utf8', 'Access-Control-Allow-Origin': '*'
        });
        if (response.status == 200) {
            console.log("返回值:\n");
            console.log(response.data);
            console.log("\n");
            res.write(JSON.stringify(response.data));
        } else {
            console.log("请求 OpenAI API 错误:\n");
            console.log(response);
            console.log("\n");
        }
    } catch (err) {
        console.log(err);
        res.writeHead(500, {//返回json格式, 允许跨域
            'Content-Type': 'application/json; charset=utf8', 'Access-Control-Allow-Origin': '*'
        });
    }
    res.end();
}

http.createServer(function (req, res) {
    var body = "";
    req.on('data', function (chunk) {//接收表单参数
        body += chunk;
    });
    req.on('end', function () {
        body = querystring.parse(body);//解析参数
        console.log("获取到POST参数:\n");
        console.log(body);
        console.log("\n");
        getOpenAI(res, body);
    });
}).listen(3000);

console.log("\n正在运行, 监听 3000 端口.\n")