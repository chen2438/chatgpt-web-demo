# OpenAI Web Demo

![image-20221221223637798](https://picgo-1303840613.cos.accelerate.myqcloud.com/media/image-20221221223637798.png)

## 安装

### 先决条件

已安装 WEB 服务器, 如 apache 或 nginx.

已安装 Node.js

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

