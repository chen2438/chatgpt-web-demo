var http = require('http');
var querystring = require('querystring');
var he = require('he');

var html1 = "<!DOCTYPE html><html lang='en-us'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width'><title>OpenAI API Demo</title><style>        .root {            width: 90%;            height: 80vh;            margin: 2em auto;        }        .root-head {                        padding-left: 1.5em;        }        .form-left,        .form-right {            border-radius: 5px;            padding: 20px;                    }        form {            width: 100%;            height: 100%;            display: grid;            grid-template-columns: 1fr 200px;            grid-gap: 20px;        }        .div-textarea {            width: 95%;            height: 80%;            padding: 1em;            border: solid;        }        textarea {            resize: none;            width: 100%;            height: 100%;            font-size: 16px;            border: none;            outline: 0;        }        input[type='submit'] {                        background-color: #10a37f;            border: none;            color: white;            padding: 10px 18px;            text-align: center;            font-size: 16px;            font-weight: bold;            border-radius: 5px;            cursor: pointer;        }        input[type='submit']:hover {            opacity: 0.7;            background-color: #10a37f;            border: none;            color: white;            padding: 10px 18px;            text-align: center;            font-size: 16px;            font-weight: bold;            border-radius: 5px;            cursor: pointer;        }</style></head><body><div class='root'><div class='root-head'><h1>OpenAI API Demo</h1><p>连续提问可能会有bug, 显示代码(特殊字符)时可能会有bug</p></div><form action='http://107.174.254.164:3000' method='post'><div class='form-left'><div class='div-textarea'><textarea name='prompt'>";

var html2 = "</textarea></div><br><input type='submit' value='submit' /></div><div class='form-right'><label><b>Mode</b></label><br><label for='mode'>Complete</label><input type='radio' name='mode' value='complete' checked><br><label><b>Model</b></label><br><label for='model'>text-davinci-003</label><input type='radio' name='model' value='text-davinci-003' checked><br><label for='temperature'><b>Temperature</b></label><br><input type='text' name='temperature' value='0.7'><br><label for='max_tokens'><b>Maximum length</b></label><br><input type='text' name='max_tokens' value='2048'><br></div></form></div></body></html>";

http.createServer(function (req, res) {
    var body = "";
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        body = querystring.parse(body);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        async function f() {
            if (body.prompt) {
                res.write(html1);
                res.write(html2);
                res.end();
                return;
            }
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
                res.write(he.encode(body.prompt));
                // res.write("<b>");
                res.write(he.encode(response.data.choices[0].text));
                res.write("\n");
                res.write(html2);
                res.end();
            } catch (err) {
                console.log(err);
                res.write(err);
                res.end();
            }

        }
        f();
    });
}).listen(3000);