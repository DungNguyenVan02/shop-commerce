const Order = require("../models/Order");
const asyncHandler = require("express-async-handler");
const moment = require("moment");

const querystring = require("qs");
const sortObject = require("../ultils/sortObject");
const crypto = require("crypto");

class OrderControllers {
	checkout = asyncHandler(async (req, res) => {
		process.env.TZ = "Asia/Ho_Chi_Minh";

		const date = new Date();

		const ipAddress =
			req.headers["x-forwarded-for"] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress;

		const createDate = moment(date).format("YYYYMMDDHHmmss");

		const tmnCode = process.env.TMN_CODE;
		const secretKey = process.env.SECRET_KEY;
		const returnUrl = process.env.RETURN_URL;

		const { amount } = req.body;
		const orderId = moment(date).format("DDHHmmss");

		let vnp_Params = {};
		vnp_Params["vnp_Version"] = "2.1.0";
		vnp_Params["vnp_Command"] = "pay";
		vnp_Params["vnp_TmnCode"] = tmnCode;
		vnp_Params["vnp_Amount"] = amount * 100;
		vnp_Params["vnp_Locale"] = "vn";
		vnp_Params["vnp_CurrCode"] = "VND";
		vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
		vnp_Params["vnp_IpAddr"] = ipAddress;
		vnp_Params["vnp_OrderType"] = "other";
		vnp_Params["vnp_ReturnUrl"] = returnUrl;
		vnp_Params["vnp_CreateDate"] = createDate;
		vnp_Params["vnp_TxnRef"] = orderId;
		vnp_Params = sortObject(vnp_Params);

		try {
			let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
			const signData = querystring.stringify(vnp_Params, {
				encode: false,
			});
			const hmac = crypto.createHmac("sha512", secretKey);
			const signed = hmac
				.update(new Buffer(signData, "utf-8"))
				.digest("hex");
			vnp_Params["vnp_SecureHash"] = signed;
			vnpUrl +=
				"?" + querystring.stringify(vnp_Params, { encode: false });
			return res.status(200).json({
				url: vnpUrl,
			});
		} catch (error) {
			return res.status(400).json({
				mes: "Có lỗi xảy ra",
			});
		}
	});

	// [POST] /
	createOrder = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const {
			products,
			total,
			method,
			address,
			isPayed = false,
			bankCode,
			code,
		} = req.body;

		if ((!total || !method || !address, !products)) {
			throw new Error("Missing input");
		}

		const payload = {
			code,
			products,
			total,
			address,
			method,
			orderBy: _id,
			isPayed,
		};

		if (bankCode) {
			payload["address"] = bankCode;
		}

		const response = await Order.create(payload);

		return res.json({
			success: response ? true : false,
			mes: response
				? "Order successfully!"
				: "Cannot create new order! please try again",
		});
	});

	// [BUT] /
	updateStatus = asyncHandler(async (req, res) => {
		const { oid } = req.params;
		const { status, isPayed } = req.body;
		if (!status) throw new Error("Missing status");
		const response = await Order.findByIdAndUpdate(
			oid,
			{ status, isPayed },
			{ new: true }
		);
		return res.status(200).json({
			success: response ? true : false,
			mes: response
				? "Update order successfully!"
				: "Something went wrong",
		});
	});

	// [BUT] /confirm/:oid
	confirmReturn = asyncHandler(async (req, res) => {
		const { oid } = req.params;
		const response = await Order.findByIdAndUpdate(
			oid,
			{ isConfirmReturn: true },
			{ new: true }
		);
		return res.status(200).json({
			success: response ? true : false,
			mes: response
				? "Confirm return and refund successfully!"
				: "Something went wrong",
		});
	});

	// [DELETE] /delete/:oid
	deleteOrder = asyncHandler(async (req, res) => {
		const { oid } = req.params;
		if (!oid) throw new Error("Missing input");
		const response = await Order.findByIdAndDelete(oid);
		return res.status(200).json({
			success: response ? true : false,
			deletedOrder: response
				? "Delete successfully!"
				: "Something went wrong",
		});
	});

	// [GET] /
	getUserHistoryOrder = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const response = await Order.find({
			orderBy: _id,
			status: "Giao hàng thành công",
		}).populate({
			path: "products",
			populate: {
				path: "product",
				select: "name category",
			},
		});
		return res.status(200).json({
			success: response ? true : false,
			listOrder: response ? response : "Entity cart order",
		});
	});

	// [GET] /return
	getReturnOrder = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const response = await Order.find({
			orderBy: _id,
			status: "Hoàn trả đơn hàng",
		}).populate({
			path: "products",
			populate: {
				path: "product",
				select: "name",
			},
		});
		return res.status(200).json({
			success: response ? true : false,
			listOrder: response ? response : "Entity cart order",
		});
	});

	// [GET] /
	getUserOrder = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const response = await Order.find({
			orderBy: _id,
			$or: [
				{
					status: [
						"Đang xử lý",
						"Giao hàng thành công",
						"Đang giao hàng",
					],
				},
			],
		}).populate({
			path: "products",
			populate: {
				path: "product",
				select: "name",
			},
		});
		return res.status(200).json({
			success: response ? true : false,
			listOrder: response ? response : "Entity cart order",
		});
	});
	// [GET] /
	getOrders = asyncHandler(async (req, res) => {
		const queries = { ...req.query };
		// Tách trường đặc biệt trên query
		const excludeFields = ["page", "sort", "limit", "fields"];
		// format lại các operators cho đúng cú pháp mongoose
		excludeFields.forEach((field) => delete queries[field]);

		let queryString = JSON.stringify(queries);
		queryString = queryString.replace(
			/\b(gte|gt|lte|lt)\b/g,
			(matchedEl) => {
				return `$${matchedEl}`;
			}
		);
		const formatQuery = JSON.parse(queryString);

		// Filtering
		if (queries?.q) {
			delete formatQuery.q;
			formatQuery["$or"] = [
				{ code: { $regex: queries.q, $options: "i" } },
			];
		}

		const q = { ...formatQuery };
		q.status = {
			$in: ["Đang xử lý", "Đang giao hàng", "Giao hàng thành công"],
		};
		q.isConfirmReturn = false;

		let queryCommand = Order.find(q)

			.populate("orderBy", "fullName phone email")
			.populate({
				path: "products",
				populate: {
					path: "product",
					select: "name",
				},
			});

		// Sorting
		if (req.query.sort) {
			const sortBy = req.query.sort.split(",").join(" ");
			queryCommand = queryCommand.sort(sortBy);
		}

		// Fields limiting
		if (req.query.fields) {
			const fields = req.query.fields.split(",").join(" ");
			queryCommand = queryCommand.select(fields);
		}
		// Pagination
		// limit: số object lấy về trong 1 lần gọi api
		// skip: số trang muốn bỏ qua
		const page = +req.query.page || 1;
		const limit = +req.query.limit || process.env.LIMIT;
		const skip = (page - 1) * limit;
		queryCommand.skip(skip).limit(limit);

		// execute query
		queryCommand.exec(async (err, response) => {
			if (err) throw new Error(err.message);
			const counts = await Order.find(q).countDocuments();
			return res.status(200).json({
				success: response ? true : false,
				counts,
				orders: response ? response : "Cannot get orders",
			});
		});
	});

	// [GET] /
	getAllOrders = asyncHandler(async (req, res) => {
		const response = await Order.find().populate({
			path: "products",
			populate: {
				path: "product",
				select: "name",
			},
		});
		return res.status(200).json({
			success: response ? true : false,
			listOrder: response ? response : "Entity cart order",
		});
	});

	// [GET] /
	getOrderReturn = asyncHandler(async (req, res) => {
		const queries = { ...req.query };
		// Tách trường đặc biệt trên query
		const excludeFields = ["page", "sort", "limit", "fields"];
		// format lại các operators cho đúng cú pháp mongoose
		excludeFields.forEach((field) => delete queries[field]);

		let queryString = JSON.stringify(queries);
		queryString = queryString.replace(
			/\b(gte|gt|lte|lt)\b/g,
			(matchedEl) => {
				return `$${matchedEl}`;
			}
		);
		const formatQuery = JSON.parse(queryString);

		// Filtering
		if (queries?.q) {
			delete formatQuery.q;
			formatQuery["$or"] = [
				{ code: { $regex: queries.q, $options: "i" } },
			];
		}

		const q = { ...formatQuery };
		q.status = "Hoàn trả đơn hàng";

		let queryCommand = Order.find(q)

			.populate("orderBy", "fullName phone email")
			.populate({
				path: "products",
				populate: {
					path: "product",
					select: "name",
				},
			});

		// Sorting
		if (req.query.sort) {
			const sortBy = req.query.sort.split(",").join(" ");
			queryCommand = queryCommand.sort(sortBy);
		}

		// Fields limiting
		if (req.query.fields) {
			const fields = req.query.fields.split(",").join(" ");
			queryCommand = queryCommand.select(fields);
		}
		// Pagination
		// limit: số object lấy về trong 1 lần gọi api
		// skip: số trang muốn bỏ qua
		const page = +req.query.page || 1;
		const limit = +req.query.limit || process.env.LIMIT;
		const skip = (page - 1) * limit;
		queryCommand.skip(skip).limit(limit);

		// execute query
		queryCommand.exec(async (err, response) => {
			if (err) throw new Error(err.message);
			const counts = await Order.find(q).countDocuments();
			return res.status(200).json({
				success: response ? true : false,
				counts,
				orders: response ? response : "Cannot get orders",
			});
		});
	});

	// [GET] /
	getOrderCanceled = asyncHandler(async (req, res) => {
		const queries = { ...req.query };
		// Tách trường đặc biệt trên query
		const excludeFields = ["page", "sort", "limit", "fields"];
		// format lại các operators cho đúng cú pháp mongoose
		excludeFields.forEach((field) => delete queries[field]);

		let queryString = JSON.stringify(queries);
		queryString = queryString.replace(
			/\b(gte|gt|lte|lt)\b/g,
			(matchedEl) => {
				return `$${matchedEl}`;
			}
		);
		const formatQuery = JSON.parse(queryString);

		// Filtering
		if (queries?.q) {
			delete formatQuery.q;
			formatQuery["$or"] = [
				{ code: { $regex: queries.q, $options: "i" } },
			];
		}

		const q = { ...formatQuery };
		q.status = { $in: ["Hủy đơn hàng"] };

		let queryCommand = Order.find(q)

			.populate("orderBy", "fullName phone email")
			.populate({
				path: "products",
				populate: {
					path: "product",
					select: "name",
				},
			});

		// Sorting
		if (req.query.sort) {
			const sortBy = req.query.sort.split(",").join(" ");
			queryCommand = queryCommand.sort(sortBy);
		}

		// Fields limiting
		if (req.query.fields) {
			const fields = req.query.fields.split(",").join(" ");
			queryCommand = queryCommand.select(fields);
		}
		// Pagination
		// limit: số object lấy về trong 1 lần gọi api
		// skip: số trang muốn bỏ qua
		const page = +req.query.page || 1;
		const limit = +req.query.limit || process.env.LIMIT;
		const skip = (page - 1) * limit;
		queryCommand.skip(skip).limit(limit);

		// execute query
		queryCommand.exec(async (err, response) => {
			if (err) throw new Error(err.message);
			const counts = await Order.find(q).countDocuments();
			return res.status(200).json({
				success: response ? true : false,
				counts,
				orders: response ? response : "Cannot get orders",
			});
		});
	});
}

module.exports = new OrderControllers();
