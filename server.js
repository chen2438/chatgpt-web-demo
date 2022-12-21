var http = require('http');
var querystring = require('querystring');
var he = require('he');

var html1 = "<!DOCTYPE html><html lang='en-us'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width'><title>OpenAI API Demo</title><style>        .root {            width: 90%;            height: 80vh;            margin: 2em auto;        }        .root-head {                        padding-left: 1.5em;        }        .form-left,        .form-right {            border-radius: 5px;            padding-left: 20px;                    }        form {            width: 100%;            height: 100%;            display: grid;            grid-template-columns: 1fr 200px;                    }        .div-textarea {            width: 95%;            height: 75%;            padding: 1em;            border: solid;        }        textarea {            resize: none;            width: 100%;            height: 100%;            font-size: 16px;            border: none;            outline: 0;        }        input[type='submit'],        button {            background-color: #10a37f;            border: none;            color: white;            padding: 8px 14px;            text-align: center;            font-size: 16px;            border-radius: 3px;            cursor: pointer;        }        button {            color: rgb(53, 53, 63);            background-color: rgb(236, 236, 241);        }        input[type='submit']:hover,        button:hover {            opacity: 0.7;        }</style></head><body><script>        $(function () {            //禁用“确认重新提交表单”            window.history.replaceState(null, null, window.location.href);        })</script><div class='root'><div class='root-head'><h1>OpenAI API Demo</h1><p>提交后请稍等, 将一次性返回所有内容; &nbsp;连续提问可能会有bug, 显示代码(特殊字符)时可能会有bug; &nbsp;清空时请点击refresh按钮, 请勿直接刷新页面</p></div><form action='http://107.174.254.164:3000' method='post'><div class='form-left'><div class='div-textarea'><textarea name='prompt'>";

var html2 = "</textarea></div><br><input type='submit' value='submit' /><button type='button' onclick='refresh();'>refresh</button><script>                    function refresh() {                        window.location.href = 'http://107.174.254.164/openai/';                    }</script></div><div class='form-right'><label><b>Mode</b></label><br><label for='mode'>Complete</label><input type='radio' name='mode' value='complete' checked><br><label><b>Model</b></label><br><label for='model'>text-davinci-003</label><input type='radio' name='model' value='text-davinci-003' checked><br><label for='temperature'><b>Temperature</b></label><br><input type='text' name='temperature' value='0.7'><br><label for='max_tokens'><b>Maximum length</b></label><br><input type='text' name='max_tokens' value='2048'><br></div></form></div></body></html>";

http.createServer(function (req, res) {
    var body = "";
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        body = querystring.parse(body);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        async function f() {
            if (!body.prompt) {
                res.write(html1);
                res.write(html2);
                res.end();
            } else {
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
                    console.log(response.data.choices[0].text);
                    res.write(html1);
                    res.write(body.prompt);
                    res.write(response.data.choices[0].text);
                    res.write("\n");
                    res.write(html2);
                    res.end();
                } catch (err) {
                    console.log(err);
                    res.write(err);
                    res.end();
                }
            }
        }
        f();
    });
}).listen(3000);

console.log("Running in port 3000.")