const { response } = require("express");
const Blog = require("../models/Blog");
const asyncHandler = require("express-async-handler");

class BlogControllers {
	// [GET] /
	getAllBlog = asyncHandler(async (req, res) => {
		const response = await Blog.find();
		return res.json({
			success: response ? true : false,
			getAllBlog: response ? response : "List blog empty !",
		});
	});

	// [POST] /
	createBlog = asyncHandler(async (req, res) => {
		const { title, description, category } = req.body;
		if (!title || !description || !category) {
			throw new Error("Missing inputs");
		}
		const response = await Blog.create(req.body);
		return res.json({
			success: response ? true : false,
			createdBlog: response ? response : "Cannot created new blog",
		});
	});

	// [PUT] /:bid
	updateBlog = asyncHandler(async (req, res) => {
		const { bid } = req.params;
		if (Object.keys(bid).length === 0) {
			throw new Error("Missing inputs");
		}
		const response = await Blog.findByIdAndUpdate(bid, req.body, {
			new: true,
		});
		return res.json({
			success: response ? true : false,
			updatedBlog: response ? response : "Cannot updated blog",
		});
	});

	// [DELETE] /:bid
	deleteBlog = asyncHandler(async (req, res) => {
		const { bid } = req.params;
		if (!bid) {
			throw new Error("Missing input !");
		}
		const response = await Blog.findByIdAndDelete(bid);
		return res.json({
			success: response ? true : false,
			deletedBlog: response
				? `Deleted ${response.title} successfully`
				: "Cannot delete blog",
		});
	});

	/*
		khi like blog:
		1. like rồi thì bỏ like
		2. dislike rồi thì bỏ dislike
	*/

	// [PUT] /like/:bid
	likeBlog = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const { bid } = req.params;

		if (!bid) {
			throw new Error("Missing input !");
		}

		const blog = await Blog.findById(bid);
		const alreadyLiked = await blog?.likes?.find(
			(uid) => uid.toString() === _id
		);
		if (alreadyLiked) {
			const response = await Blog.findByIdAndUpdate(
				bid,
				{
					$pull: { likes: _id },
				},
				{ new: true }
			);

			return res.status(200).json({
				success: response ? true : false,
				res: response ? response : "something went wrong !!",
			});
		} else {
			const response = await Blog.findByIdAndUpdate(
				bid,
				{
					$push: { likes: _id },
					$pull: { dislikes: _id },
				},
				{ new: true }
			);

			return res.status(200).json({
				success: response ? true : false,
				res: response ? response : "something went wrong !!",
			});
		}
	});

	// [PUT] /dislike/:bid
	dislikeBlog = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const { bid } = req.params;

		if (!bid) {
			throw new Error("Missing input !");
		}

		const blog = await Blog.findById(bid);

		// Check xem trong danh sách dislike có uid không
		const alreadyDisliked = blog?.dislikes?.find(
			(uid) => uid.toString() === _id
		);

		// Nếu có chuyển xóa uid ra khỏi danh sách dislike
		if (alreadyDisliked) {
			const response = await Blog.findByIdAndUpdate(
				bid,
				{
					$pull: { dislikes: _id },
				},
				{ new: true }
			);

			return res.status(200).json({
				success: response ? true : false,
				res: response ? response : "something went wrong !!",
			});
		} else {
			const response = await Blog.findByIdAndUpdate(
				bid,
				{
					$push: { dislikes: _id },
					$pull: { likes: _id },
				},
				{ new: true }
			);

			return res.status(200).json({
				success: response ? true : false,
				res: response ? response : "something went wrong !!",
			});
		}
	});

	// [GET] /:bid
	getBlog = asyncHandler(async (req, res) => {
		const { bid } = req.params;
		const excludedFields = "firstName lastName";
		const blog = await Blog.findByIdAndUpdate(
			bid,
			{ $inc: { views: 1 } },
			{ new: true }
		)
			.populate("likes", excludedFields)
			.populate("dislikes", excludedFields);
		return res.status(200).json({
			success: blog ? true : false,
			res: blog ? blog : "something went wrong !!",
		});
	});
}

module.exports = new BlogControllers();
