const Blog = require("../models/Blog");
const asyncHandler = require("express-async-handler");

class BlogControllers {
	// [GET] /
	getAllBlog = asyncHandler(async (req, res) => {
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
				{ title: { $regex: queries.q, $options: "i" } },
			];
		}

		const q = { ...formatQuery };

		let queryCommand = Blog.find(q);

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
		const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
		const skip = (page - 1) * limit;
		queryCommand.skip(skip).limit(limit);

		// execute query
		queryCommand.exec(async (err, response) => {
			if (err) throw new Error(err.message);
			const counts = await Blog.find(q).countDocuments();
			return res.status(200).json({
				success: response ? true : false,
				counts,
				blogs: response ? response : "Cannot get blogs",
			});
		});
	});

	// [POST] /
	createBlog = asyncHandler(async (req, res) => {
		const { title, description } = req.body;
		const image = req?.file.path;

		if (!title || !description) {
			throw new Error("Missing inputs");
		}
		const data = {
			title,
			description,
			image,
		};
		const response = await Blog.create(data);
		return res.json({
			success: response ? true : false,
			createdBlog: response ? response : "Cannot created new blog",
		});
	});

	// [PUT] /:bid
	updateBlog = asyncHandler(async (req, res) => {
		const { bid } = req.params;
		const { title, description } = req.body;

		if (!title || !description || !bid) {
			throw new Error("Missing inputs");
		}
		let data;
		const payload = {
			title,
			description,
		};

		if (req?.file) {
			const image = req?.file.path;
			data = {
				...payload,
				image,
			};
		} else {
			data = { ...payload };
		}

		const response = await Blog.findByIdAndUpdate(bid.trim(), data, {
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
		const response = await Blog.findByIdAndDelete(bid.trim());
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
		const blog = await Blog.findByIdAndUpdate(
			bid,
			{ $inc: { views: 1 } },
			{ new: true }
		);
		return res.status(200).json({
			success: blog ? true : false,
			blog: blog ? blog : "something went wrong !!",
		});
	});

	// [PUT] /upload-image/:bid
	uploadImageBlog = asyncHandler(async (req, res) => {
		const { bid } = req.params;
		if (!req.file) throw new Error("Missing inputs");
		const response = await Blog.findByIdAndUpdate(
			bid,
			{ image: req.file.path },
			{
				new: true,
			}
		);
		return res.status(200).json({
			success: response ? true : false,
			updatedBlog: response ? response : "Cannot upload image",
		});
	});
}

module.exports = new BlogControllers();
