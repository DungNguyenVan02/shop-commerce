const userRouter = require("./User");
const productRouter = require("./Product");
const { notFound, errHandler } = require("../middlewares/errorHandle");

function routes(app) {
	app.use("/api/user", userRouter);
	app.use("/api/product", productRouter);

	// handle error
	app.use(notFound);
	app.use(errHandler);
}

module.exports = routes;
