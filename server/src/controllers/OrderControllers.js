const Order = require("../models/Order");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { v4: uuid } = require("uuid");

class OrderControllers {
	// [POST] /
	createOrder = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const { products, total, method, address } = req.body;

		if ((!total || !method || !address, !products)) {
			throw new Error("Missing input");
		}

		const response = await Order.create({
			code: uuid(),
			products,
			total,
			address,
			method,
			orderBy: _id,
		});

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
		const { status } = req.body;
		if (!status) throw new Error("Missing status");
		const response = await Order.findByIdAndUpdate(
			oid,
			{ status },
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
			status: "Success",
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

	// [GET] /return
	getReturnOrder = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const response = await Order.find({
			orderBy: _id,
			status: "Return",
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
			$or: [{ status: ["Processing", "Success", "Transported"] }],
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
				{ status: { $regex: queries.q, $options: "i" } },
			];
		}

		// if (queries?.status) {
		// 	delete formatQuery.status;
		// 	formatQuery.status = queries.status;
		// }

		const q = { ...formatQuery };
		q.status = { $in: ["Success", "Processing", "Transported"] };
		q.isConfirmReturn = false;

		let queryCommand = Order.find(q)

			.populate("orderBy", "firstName lastName phone email")
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
		q.status = "Return";

		let queryCommand = Order.find(q)

			.populate("orderBy", "firstName lastName phone email")
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
		q.status = "Canceled";

		let queryCommand = Order.find(q)

			.populate("orderBy", "firstName lastName phone email")
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
