const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const fs = require('fs');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const app = express();
app.use(cors());//允许跨域
app.use(bodyParser.json());//解析JSON格式的请求体
app.use(session({
	name: 'id-login',
	secret: "mySecretKey",
	resave: false,
	saveUninitialized: true
}));

// Mock user database
const users = [
	{ "username": "admin", "password": "admin", "id": "123" },
	{ "username": "bob", "password": "password2", "id": "123" }
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
	if (req.isAuthenticated()) {
		return next();
	} else if (req.session && req.session.user) {
		return next();
		//若没有调用 next() 方法，请求被挂起，客户端一直处于等待状态。
	} else {
		res.redirect("/chat/login");
		return;
	}
}

// Home page route
app.get("/chat/home", requireLogin, (req, res) => {
	// Return the home page HTML
	fs.readFile('home.html', 'utf8', (err, data) => {
		if (err) throw err;
		res.send(data);
	});
});

// Logout route
app.get("/chat/logout", (req, res) => {
	// Destroy the session and redirect to login page
	req.session.destroy();
	res.redirect("/chat/login");
});

app.get("/chat/login", (req, res) => {
	// Return the login page HTML
	fs.readFile('login.html', 'utf8', (err, data) => {
		if (err) throw err;
		res.send(data);
	});
});


// GitHub OAuth 验证
// 获取环境变量
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

app.use(session({
	name: 'github-login',
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
	clientID: GITHUB_CLIENT_ID,
	clientSecret: GITHUB_CLIENT_SECRET,
	callbackURL: CALLBACK_URL
},
	function (accessToken, refreshToken, profile, cb) {
		// Simulate finding or creating user by GitHub ID
		const user = users.find(u => u.id === profile.id) || {
			id: profile.id,
			username: profile.username,
			password: 'pass' + profile.id
		};
		return cb(null, user);
	}));

passport.serializeUser(function (user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
	const user = users.find(u => u.id === id);
	cb(null, user);
});

app.get('/chat/auth/github',
	passport.authenticate('github'));

app.get('/chat/auth/github/callback',
	passport.authenticate('github', { failureRedirect: '/chat/login' }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect('/chat/home');
	});


// Start the server
app.listen(3000, () => {
	console.log("Server listening on port 3000");
});