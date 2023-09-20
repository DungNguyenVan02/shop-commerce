const userRouter = require("./User");
const { notFound, errHandler } = require("../middlewares/errorHandle");

function routes(app) {
	app.use("/api/user", userRouter);

	// handle error
	app.use(notFound);
	app.use(errHandler);
}

module.exports = routes;
