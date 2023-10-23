const Products = require("../models/Product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

class ProductControllers {
	// [POST] /createproduct
	createProduct = asyncHandler(async (req, res) => {
		const { name } = req.body;
		if (Object.keys(req.body).length === 0) {
			throw new Error("Missing inputs");
		}

		if (req.body && req.body.name) {
			req.body.slug = slugify(name);
		}

		const newProduct = await Products.create(req.body);

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
		const product = await Products.findById(pid);

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

		// Filtering
		if (queries?.name) {
			formatQuery.name = { $regex: queries.name, $options: "i" };
		}
		let queryCommand = Products.find(formatQuery);

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
			const counts = await Products.find(formatQuery).countDocuments();
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
		const updatedProduct = await Products.findByIdAndUpdate(pid, req.body, {
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
		const deletedProduct = await Products.findByIdAndDelete(pid);
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
		const { star, comment, pid } = req.body;
		if (!star || !pid) {
			throw new Error("Missing inputs");
		}

		const productRating = await Products.findById(pid);
		const alreadyRating = await productRating.ratings.find(
			(el) => el.postedBy.toString() === _id
		);
		if (alreadyRating) {
			// update star && comments
			await Products.updateOne(
				{
					ratings: { $elemMatch: alreadyRating },
				},
				{
					$set: {
						"ratings.$.star": star,
						"ratings.$.comment": comment,
					},
				},
				{ new: true }
			);
		} else {
			// Add star && comments
			await Products.findByIdAndUpdate(
				pid,
				{
					$push: { ratings: { star, comment, postedBy: _id } },
				},
				{ new: true }
			);
		}

		// Tính trung bình số sao sản phẩm
		const sumRating = productRating.ratings.length;
		const sumStars = productRating.ratings.reduce(
			(total, element) => total + parseInt(element.star),
			0
		);
		productRating.totalRatings =
			Math.round((sumStars * 10) / sumRating) / 10;
		await productRating.save();

		return res.status(200).json({
			status: true,
			productRating,
		});
	});
}

module.exports = new ProductControllers();
