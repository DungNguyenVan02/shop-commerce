const express = require("express");
require("dotenv").config();
const db = require("./config/db");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5001;

// socket
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { log } = require("console");

const io = new Server({ cors: "http://localhost:3000" });

let activeUsers = [];

io.on("connection", (socket) => {
	// add new user
	socket.on("new-user-add", (newUserId) => {
		if (!activeUsers.some((user) => user.userId === newUserId)) {
			activeUsers.push({
				userId: newUserId,
				socketId: socket.id,
			});
		}
		io.emit("get-user", activeUsers);
	});

	// Send message
	socket.on("send-message", (data) => {
		const { receiverId } = data;
		const user = activeUsers.find((user) => user.userId === receiverId);

		if (user) {
			io.to(user.socketId).emit("receive-message", data);
		}
	});

	socket.on("disconnect", () => {
		activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);

		io.emit("get-user", activeUsers);
	});
});

io.listen(8080);

app.use(
	cors({
		origin: process.env.URL_CLIENT,
		methods: ["GET", "PUT", "POST", "DELETE"],
	})
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Connect to mongodb server
db.connect();

// Routes app
routes(app);

app.listen(port, () => {
	console.log("Server listening on port " + port);
});
