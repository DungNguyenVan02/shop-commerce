const express = require("express");
require("dotenv").config();
const db = require("./config/db");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(
	cors({
		origin: process.env.URL_CLIENT,
		methods: ["GET", "PUT", "POST", "DELETE"],
	})
);
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// web socket
// const server = http.createServer(app);
// const io = new Server(server, {
// 	cors: {
// 		origin: process.env.URL_CLIENT,
// 		methods: ["GET", "PUT", "POST", "DELETE"],
// 	},
// });

// io.on("connection", (socket) => {
// 	console.log("connect");
// 	socket.on("rating", (data) => {
// 		io.emit("response_rating", data);
// 	});
// });

// Connect to mongodb server
db.connect();

// Routes app
routes(app);

app.listen(port, () => {
	console.log("Server listening on port " + port);
});
