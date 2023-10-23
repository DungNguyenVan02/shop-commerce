const Categories = require("../models/Categories");
const asyncHandler = require("express-async-handler");

class CategoryControllers {
	// [GET] /
	getAllCategory = asyncHandler(async (req, res) => {
		const response = await Categories.find().select("name _id");
		return res.json({
			success: response ? true : false,
			getAllCategory: response ? response : "category product empty!",
		});
	});
	// [POST] /
	createCategory = asyncHandler(async (req, res) => {
		const response = await Categories.create(req.body);
		return res.json({
			success: response ? true : false,
			createdCategory: response
				? response
				: "Cannot create category product !",
		});
	});
	// [PUT] /:cid
	updateCategory = asyncHandler(async (req, res) => {
		const { cid } = req.params;
		const { name } = req.body;
		if (!name || name === " ") {
			throw new Error("Missing input!");
		}
		const response = await Categories.findByIdAndUpdate(
			cid,
			{ name },
			{
				new: true,
			}
		);

		return res.status(200).json({
			success: true,
			updatedCategory: response
				? response
				: "Cannot update category product",
		});
	});

	// [DELETE] /:cid
	deleteCategory = asyncHandler(async (req, res) => {
		const { cid } = req.params;
		const response = await Categories.findByIdAndDelete(cid);

		return res.status(200).json({
			success: true,
			deletedCategory: response
				? `Delete category "${response.name}" successfully`
				: "Cannot delete category product",
		});
	});
}

module.exports = new CategoryControllers();
