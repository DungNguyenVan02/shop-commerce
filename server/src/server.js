const express = require("express");
require("dotenv").config();
const db = require("./config/db");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

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

// Connect to mongodb server
db.connect();

// Routes app
routes(app);

app.listen(port);
