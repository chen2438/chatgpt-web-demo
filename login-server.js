const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const fs = require('fs');

const app = express();
app.use(cors());//允许跨域
app.use(bodyParser.json());//解析JSON格式的请求体
app.use(session({
	secret: "mySecretKey",
	resave: false,
	saveUninitialized: true
}));

// Mock user database
const users = [
	{ "username": "admin", "password": "admin" },
	{ "username": "bob", "password": "password2" }
];

// Login route
app.post("/chat/login", (req, res) => {
	// Check if the username and password are valid
	const username = req.body.username;
	const password = req.body.password;
	const user = users.find(u => u.username === username && u.password === password);
	if (user) {
		// Login successful, return 200 OK status
		req.session.user = user;
		res.sendStatus(200);
	} else {
		// Login failed, return 401 Unauthorized status
		res.sendStatus(401);
	}
});

// Authentication middleware
function requireLogin(req, res, next) {
	if (req.session && req.session.user) {
		next();
		//若没有调用 next() 方法，请求被挂起，客户端一直处于等待状态。
		return;
	} else {
		res.redirect("/chat/login");
	}
}

// Home page route
app.get("/chat/home", requireLogin, (req, res) => {
	// Return the home page HTML
	res.send(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Home Page</title>
		</head>
		<body>
			<h1>Welcome to the Home Page</h1>
		</body>
		</html>
	`);
});

// Logout route
app.get("/chat/logout", (req, res) => {
	// Destroy the session and redirect to login page
	req.session.destroy();
	res.redirect("/login");
});

app.get("/chat/login", (req, res) => {
	// Return the login page HTML
	// 读取文件
	fs.readFile('login.html', 'utf8', (err, data) => {
		if (err) throw err;
		// console.log(data);
		res.send(data);
	});
});

// Start the server
app.listen(3000, () => {
	console.log("Server listening on port 3000");
});