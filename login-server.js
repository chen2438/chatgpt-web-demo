const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");

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

// Authentication middleware
function requireLogin(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

// Login route
app.post("/login", (req, res) => {
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

// Home page route
app.get("/home", (req, res) => {
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
app.get("/logout", (req, res) => {
    // Destroy the session and redirect to login page
    req.session.destroy();
    res.redirect("/login");
});

// Start the server
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});



app.get("/login", (req, res) => {
    // Return the login page HTML
    res.send(`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Login Page</title>
		</head>
		<body>
			<h1>Login Page</h1>
			<form>
				<label>Username:</label>
				<input type="text" id="username" name="username"><br><br>
				<label>Password:</label>
				<input type="password" id="password" name="password"><br><br>
				<button type="button" onclick="login()">Login</button>
			</form>
			<p id="message"></p>
			<script>
				function login() {
					// Get the username and password from the form
					var username = document.getElementById("username").value;
					var password = document.getElementById("password").value;
					// Send a POST request to the server to check the username and password
					var xhr = new XMLHttpRequest();
					xhr.open("POST", "/login");
					xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
					xhr.onload = function() {
						if (xhr.status === 200) {
							// Login successful, redirect to home page
							window.location.href = "/home";
						} else {
							// Login failed, display error message
							document.getElementById("message").innerHTML = "Invalid username or password
                        }
                    };
                    xhr.send(JSON.stringify({"username": username, "password": password}));
                }
            </script>
        </body>
        </html>
    `);
});
