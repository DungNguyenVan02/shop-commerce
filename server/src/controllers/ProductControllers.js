const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

class ProductControllers {
	// [POST] /createproduct
	createProduct = asyncHandler(async (req, res) => {
		const { name, price, description, category, brand, quantity, color } =
			req.body;
		const thumb = req?.files?.thumb[0]?.path;
		const images = req.files?.images?.map((el) => el.path);
		if (
			!name ||
			!price ||
			!description ||
			!category ||
			!brand ||
			!quantity ||
			!color
		) {
			throw new Error("Missing inputs");
		}

		if (name) {
			req.body.slug = slugify(name);
		}
		if (thumb) req.body.thumb = thumb;
		if (images) req.body.images = images;

		const newProduct = await Product.create(req.body);

		return res.status(200).json({
			success: newProduct ? true : false,
			createdProduct: newProduct
				? newProduct
				: "Cannot create new product",
		});
	});

	// [GET] /:pid
	getProduct = asyncHandler(async (req, res) => {
		const { pid } = req.params;
		const product = await Product.findById(pid).populate({
			path: "ratings",
			populate: {
				path: "postedBy",
				select: "firstName lastName image",
			},
		});

		return res.status(200).json({
			success: product ? true : false,
			getProduct: product ? product : "Cannot get product",
		});
	});

	// [GET] /allproducts
	getAllProduct = asyncHandler(async (req, res) => {
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
		let colorQueryObj = {};

		// Filtering
		if (queries?.q) {
			delete formatQuery.q;
			formatQuery["$or"] = [
				{ name: { $regex: queries.q, $options: "i" } },
				{ category: { $regex: queries.q, $options: "i" } },
			];
		}

		if (queries?.color) {
			delete formatQuery.color;
			const colorArr = queries.color?.split(",");
			const colorQuery = colorArr.map((el) => ({
				color: { $regex: el, $options: "i" },
			}));
			colorQueryObj = { $or: colorQuery };
		}

		const q = { ...colorQueryObj, ...formatQuery };

		let queryCommand = Product.find(q);

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
			const counts = await Product.find(q).countDocuments();
			return res.status(200).json({
				success: response ? true : false,
				counts,
				products: response ? response : "Cannot get products",
			});
		});
	});

	// [PUT] /:pid
	updateProduct = asyncHandler(async (req, res) => {
		const { pid } = req.params;
		const { name } = req.body;
		if (name) {
			req.body.slug = slugify(name);
		}
		const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
			new: true,
		});

		return res.status(200).json({
			success: updatedProduct ? true : false,
			productsData: updatedProduct
				? updatedProduct
				: "Cannot update products",
		});
	});

	// [DELETE] /:pid
	deleteProduct = asyncHandler(async (req, res) => {
		const { pid } = req.params;
		const deletedProduct = await Product.findByIdAndDelete(pid);
		return res.status(200).json({
			success: deletedProduct ? true : false,
			deletedProduct: deletedProduct
				? deletedProduct
				: "Cannot delete product",
		});
	});

	// [PUT] /ratings
	ratings = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const { star, comment, pid, date, time } = req.body;
		if (!star || !pid || !comment) {
			throw new Error("Missing inputs");
		}

		const productRating = await Product.findById(pid);
		const alreadyRating = productRating.ratings.find(
			(el) => el.postedBy.toString() === _id
		);
		if (alreadyRating) {
			// update star && comments
			await Product.updateOne(
				{
					ratings: { $elemMatch: alreadyRating },
				},
				{
					$set: {
						"ratings.$.star": star,
						"ratings.$.comment": comment,
						"ratings.$.date": date,
						"ratings.$.time": time,
					},
				},
				{ new: true }
			);
		} else {
			// Add star && comments
			await Product.findByIdAndUpdate(
				pid,
				{
					$push: {
						ratings: {
							star,
							postedBy: _id,
							comment,
							date,
							time,
						},
					},
				},
				{ new: true }
			);
		}

		// Tính trung bình số sao sản phẩm
		const productUpdateRate = await Product.findById(pid);
		const sumRating = productUpdateRate.ratings.length;
		const sumStars = productUpdateRate.ratings.reduce(
			(total, element) => total + parseInt(element.star),
			0
		);
		productUpdateRate.totalRatings = (
			(sumStars * 10) /
			sumRating /
			10
		).toFixed(1);
		await productUpdateRate.save();

		return res.status(200).json({
			success: true,
			productUpdateRate,
		});
	});

	// [PUT]  /upload-images/:pid
	uploadImageProduct = asyncHandler(async (req, res) => {
		const { pid } = req.params;
		if (!req.files) throw new Error("Missing inputs");
		const response = await Product.findByIdAndUpdate(
			pid,
			{
				$push: { images: { $each: req.files.map((el) => el.path) } },
			},
			{ new: true }
		);
		return res.status(200).json({
			success: response ? true : false,
			updatedProduct: response
				? response
				: "Cannot upload images product",
		});
	});
}

module.exports = new ProductControllers();
