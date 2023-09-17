const express = require("express");
require("dotenv").config();
const db = require("./config/db");
const routes = require("./routes");

const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to mongodb server
db.connect();

// Routes app
routes(app);

app.listen(port);
