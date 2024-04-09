const userRouter = require("./User");
const productRouter = require("./Product");
const categoryRouter = require("./Category");
const blogCategoryRouter = require("./BlogCategory");
const blogRouter = require("./Blog");
const brandRouter = require("./Brand");
const couponRouter = require("./Coupon");
const orderRouter = require("./Order");
const chatRouter = require("./Chat");
const messageRouter = require("./Message");
const insertDataRouter = require("./InsertData");

const { notFound, errHandler } = require("../middlewares/errorHandle");

function routes(app) {
	app.use("/api/user", userRouter);
	app.use("/api/product", productRouter);
	app.use("/api/category", categoryRouter);
	app.use("/api/blog-category", blogCategoryRouter);
	app.use("/api/blog", blogRouter);
	app.use("/api/brand", brandRouter);
	app.use("/api/coupon", couponRouter);
	app.use("/api/order", orderRouter);
	app.use("/api/chat", chatRouter);
	app.use("/api/message", messageRouter);
	app.use("/api/insert", insertDataRouter);

	// handle error
	app.use(notFound);
	app.use(errHandler);
}

module.exports = routes;
