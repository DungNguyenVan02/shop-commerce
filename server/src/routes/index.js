const userRouter = require("./User");

function routes(app) {
	app.use("/api/user", userRouter);
}

module.exports = routes;
