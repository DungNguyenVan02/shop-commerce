const Brand = require("../models/Brand");
const asyncHandler = require("express-async-handler");

class BrandControllers {
	// [GET] /
	getBrands = asyncHandler(async (req, res) => {
		const response = await Brand.find().select("name _id");
		return res.json({
			success: response ? true : false,
			getBrands: response ? response : "Brand product empty!",
		});
	});

	// [POST] /
	createBrand = asyncHandler(async (req, res) => {
		const { name } = req.body;
		if (!name || name === " ") {
			throw new Error("Missing input!");
		}
		const response = await Brand.create(req.body);
		return res.json({
			success: response ? true : false,
			createdBrand: response
				? response
				: "Cannot create new blog category product !",
		});
	});
	// [PUT] /:bid
	updateBrand = asyncHandler(async (req, res) => {
		const { bid } = req.params;
		const { name } = req.body;
		if (!name || name === " ") {
			throw new Error("Missing input!");
		}
		const response = await Brand.findByIdAndUpdate(
			bid,
			{ name },
			{
				new: true,
			}
		);

		return res.status(200).json({
			success: true,
			updatedBrand: response ? response : "Cannot update brand product",
		});
	});

	// [DELETE] /:bid
	deleteBrand = asyncHandler(async (req, res) => {
		const { bid } = req.params;
		const response = await Brand.findByIdAndDelete(bid);

		return res.status(200).json({
			success: true,
			deletedBrand: response
				? `Delete brand "${response.name}" successfully`
				: "Cannot delete brand product",
		});
	});
}

module.exports = new BrandControllers();
