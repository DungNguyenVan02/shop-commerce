const Order = require("../models/Order");
const User = require("../models/User");
const coupon = require("../models/Coupon");
const asyncHandler = require("express-async-handler");
const Coupon = require("../models/Coupon");

class OrderControllers {
	// [POST] /
	createOrder = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const { coupon, address } = req.body;
		if (!address) {
			throw new Error("Missing address");
		}
		const userCart = await User.findById(_id)
			.select("cart address")
			.populate("cart.product", "name price address");
		const addressSelect = userCart?.address?.find((el) => el === address);

		if (userCart) {
			const products = userCart?.cart?.map((el) => ({
				product: el.product._id,
				count: el.quantity,
				color: el.color,
			}));
			let total = userCart?.cart?.reduce((sum, el) => {
				return el.product.price * el.quantity + sum;
			}, 0);
			if (coupon) {
				const couponSelected = await Coupon.findById(coupon);
				total =
					Math.round(
						(total * (1 - couponSelected?.discount / 100)) / 1000
					) * 1000 || total;
			}

			const response = await Order.create({
				products,
				total,
				coupon,
				address: addressSelect,
				orderBy: _id,
			});

			return res.json({
				success: response ? true : false,
				createdOrder: response ? response : "Cannot create new order",
			});
		} else {
			return res.json({
				success: false,
				response: "Something went wrong",
			});
		}
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
			updatedStatus: response ? response : "Something went wrong",
		});
	});

	// [DELETE] /delete/:oid
	cancelOrder = asyncHandler(async (req, res) => {
		const { oid } = req.params;
		if (!oid) throw new Error("Missing input");
		const response = await Order.findByIdAndDelete(oid);
		return res.status(200).json({
			success: response ? true : false,
			deletedOrder: response
				? "Cancel successfully"
				: "Something went wrong",
		});
	});

	// [GET] /
	getUserOrder = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const response = await Order.find({ orderBy: _id });
		return res.status(200).json({
			success: response ? true : false,
			listOrder: response ? response : "Entity cart order",
		});
	});
	// [GET] /
	getOrders = asyncHandler(async (req, res) => {
		const response = await Order.find();
		return res.status(200).json({
			success: response ? true : false,
			listOrder: response ? response : "Entity cart order",
		});
	});
}

module.exports = new OrderControllers();
