const BlogCategory = require("../models/BlogCategory");
const asyncHandler = require("express-async-handler");

class BlogCategoryControllers {
	// [GET] /
	getAllBlogCategory = asyncHandler(async (req, res) => {
		const response = await BlogCategory.find().select("title _id");
		return res.json({
			success: response ? true : false,
			getAllBlogCategory: response
				? response
				: "Blog category product empty!",
		});
	});
	// [POST] /
	createBlogCategory = asyncHandler(async (req, res) => {
		const { name } = req.body;
		if (!name || name === " ") {
			throw new Error("Missing input!");
		}
		const response = await BlogCategory.create(req.body);
		return res.json({
			success: response ? true : false,
			createdBlogCategory: response
				? response
				: "Cannot create new blog category product !",
		});
	});
	// [PUT] /:bcid
	updateBlogCategory = asyncHandler(async (req, res) => {
		const { bcid } = req.params;
		const { title } = req.body;
		if (!title || title === " ") {
			throw new Error("Missing input!");
		}
		const response = await BlogCategory.findByIdAndUpdate(
			bcid,
			{ title },
			{
				new: true,
			}
		);

		return res.status(200).json({
			success: true,
			updatedBlogCategory: response
				? response
				: "Cannot update blog category product",
		});
	});

	// [DELETE] /:bcid
	deleteBlogCategory = asyncHandler(async (req, res) => {
		const { bcid } = req.params;
		const response = await BlogCategory.findByIdAndDelete(bcid);

		return res.status(200).json({
			success: true,
			deletedBlogCategory: response
				? `Delete category "${response.title}" successfully`
				: "Cannot delete blog category product",
		});
	});
}

module.exports = new BlogCategoryControllers();
