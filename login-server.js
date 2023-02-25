const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock user database
const users = [
    { "username": "admin", "password": "admin" },
    { "username": "bob", "password": "password2" }
];

// Login route
app.post("/login", (req, res) => {
    // Check if the username and password are valid
    const username = req.body.username;
    const password = req.body.password;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        // Login successful, return 200 OK status
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

// Start the server
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
