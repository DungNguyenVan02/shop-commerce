const Coupon = require("../models/Coupon");
const asyncHandler = require("express-async-handler");
class CouponControllers {
	// [GET] /
	getCoupons = asyncHandler(async (req, res) => {
		const response = await Coupon.find();
		return res.status(200).json({
			success: response ? true : false,
			getCoupons: response ? response : "Coupon empty!",
		});
	});

	// [POST] /
	createCoupon = asyncHandler(async (req, res) => {
		const { name, discount, expiry } = req.body;
		if (!name || !discount || !expiry) {
			throw new Error("Missing input!");
		}
		const response = await Coupon.create({
			...req.body,
			expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
		});
		return res.json({
			success: response ? true : false,
			createdCoupon: response ? response : "Cannot create new coupon !",
		});
	});
	// [PUT] /:cid
	updateCoupon = asyncHandler(async (req, res) => {
		const { cid } = req.params;
		const { expiry } = req.body;

		if (Object.keys(req.body).length === 0) {
			throw new Error("Missing input!");
		}

		if (expiry) {
			req.body.expiry = Date.now() + +expiry * 24 * 60 * 60 * 1000;
		}
		const response = await Coupon.findByIdAndUpdate(cid, req.body, {
			new: true,
		});

		return res.status(200).json({
			success: true,
			updatedCoupon: response ? response : "Cannot update Coupon !",
		});
	});

	// [DELETE] /:cid
	deleteCoupon = asyncHandler(async (req, res) => {
		const { cid } = req.params;
		const response = await Coupon.findByIdAndDelete(cid);

		return res.status(200).json({
			success: true,
			deletedCoupon: response
				? `Delete Coupon "${response.name}" successfully`
				: "Cannot delete Coupon !",
		});
	});

	// [GET] /:cid
	getCoupon = asyncHandler(async (req, res) => {
		const { cid } = req.params;
		const response = await Coupon.findById(cid).select(
			"-createdAt -updatedAt"
		);

		return res.status(200).json({
			success: response ? true : false,
			getCoupon: response ? response : "Something went wrong!",
		});
	});
}

module.exports = new CouponControllers();
