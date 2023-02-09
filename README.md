# OpenAI Web Demo

**请注意, 本代码嵌入 Google AdSense 广告服务, 请自行删除或替换!**

![image-20221221223637798](https://media.opennet.top/i/2023/01/08/63babd909b3ca.png)

## TODO

1. 返回数据支持流式传输(hard)
2. 支持更多模型参数配置
3. 模型参数悬浮窗提示
4. 优化在手机上的浏览体验
5. 超过最大长度提示

## 安装

### 先决条件

已安装 WEB 服务器, 如 apache 或 nginx.

已安装 Node.js

### 配置 TLS 证书

待更新

### 配置 API Key

在 [官方API页面](https://beta.openai.com/account/api-keys) 获取你的 API Key

编辑/etc/profile文件, 在文件末尾添加 `export OPENAI_API_KEY='你的API Key'`

```bash
sudo vim /etc/profile
```

使环境变量生效

```bash
source /etc/profile
```

### 安装 WEB 服务

进入网站根目录, 这里是 /var/www/html

```bash
cd /var/www/html
```

克隆仓库

```bash
git clone https://github.com/chen2438/chatgpt-web-demo.git
```

进入项目目录

```bash
cd chatgpt-web-demo
```

安装 OpenAI Node.js 库

```bash
npm i openai
```

启动服务

```bash
node server.js
```

## 使用

浏览器输入 你的IP地址/chatgpt-web-demo 即可

