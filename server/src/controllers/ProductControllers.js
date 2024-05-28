const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { v4: uuid } = require("uuid");

class ProductControllers {
	// [POST] /
	createProduct = asyncHandler(async (req, res) => {
		const {
			name,
			price,
			description,
			blogProduct,
			category,
			brand,
			quantity,
			color,
			ram,
			internalMemory,
		} = req.body;
		const thumb = req?.files?.thumb[0]?.path;
		const images = req.files?.images?.map((el) => el.path);
		if (
			!name ||
			!price ||
			!description ||
			!blogProduct ||
			!category ||
			!brand ||
			!quantity ||
			!color ||
			!ram ||
			!internalMemory
		) {
			throw new Error("Missing inputs");
		}

		const payload = {
			name,
			price,
			description,
			blog: blogProduct,
			category,
			brand,
			quantity,
			color,
			ram,
			internalMemory,
		};

		if (name) {
			payload.slug = slugify(name);
		}
		if (thumb) payload.thumb = thumb;
		if (images) payload.images = images;

		const newProduct = await Product.create(payload);

		return res.status(200).json({
			success: newProduct ? true : false,
			createdProduct: newProduct
				? newProduct
				: "Cannot create new product",
		});
	});

	// [POST] /create-accessory
	createAccessory = asyncHandler(async (req, res) => {
		const {
			name,
			price,
			description,
			blogProduct,
			category,
			brand,
			quantity,
			color,
		} = req.body;
		const thumb = req?.files?.thumb[0]?.path;
		const images = req.files?.images?.map((el) => el.path);
		if (
			!name ||
			!price ||
			!description ||
			!blogProduct ||
			!category ||
			!brand ||
			!quantity ||
			!color
		) {
			throw new Error("Missing inputs");
		}

		const payload = {
			name,
			price,
			description,
			blog: blogProduct,
			category,
			brand,
			quantity,
			color,
		};

		if (name) {
			payload.slug = slugify(name);
		}
		if (thumb) payload.thumb = thumb;
		if (images) payload.images = images;

		const newProduct = await Product.create(payload);

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

		// Filtering
		if (queries?.q) {
			delete formatQuery.q;
			formatQuery["$or"] = [
				{ name: { $regex: queries.q, $options: "i" } },
				{ category: { $regex: queries.q, $options: "i" } },
				{ brand: { $regex: queries.q, $options: "i" } },
			];
		}

		let colorQueryObj = {};
		if (queries?.color) {
			delete formatQuery.color;
			const colorArr = queries.color?.split(",");
			const colorQuery = colorArr.map((el) => ({
				color: { $regex: el, $options: "i" },
			}));
			colorQueryObj = { $or: colorQuery };
		}

		let brandQueryObj = {};
		if (queries?.brand) {
			delete formatQuery.brand;
			const brandArr = queries.brand?.split(",");
			const brandQuery = brandArr.map((el) => ({
				brand: { $regex: el, $options: "i" },
			}));
			brandQueryObj = { $or: brandQuery };
		}

		let categoryQueryObj = {};
		if (queries?.category) {
			delete formatQuery.category;
			const categoryArr = queries.category?.split(",");
			const categoryQuery = categoryArr.map((el) => ({
				category: { $regex: el, $options: "i" },
			}));
			categoryQueryObj = { $or: categoryQuery };
		}

		let brandCategoryQueryObj = {};
		if (queries?.brand_category) {
			delete formatQuery.brand_category;
			const brandCategoryArr = queries.brand_category?.split(",");

			brandCategoryQueryObj = {
				$and: [
					{
						brand: brandCategoryArr[0],
						category: brandCategoryArr[1],
					},
				],
			};
		}

		const q = {
			...categoryQueryObj,
			...brandQueryObj,
			...colorQueryObj,
			...formatQuery,
			...brandCategoryQueryObj,
		};
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
		const limit = +req.query.limit || process.env.LIMIT;
		const skip = (page - 1) * limit;
		queryCommand.skip(skip).limit(limit);

		// execute query
		queryCommand.exec(async (err, response) => {
			if (err) throw new Error(err.message);
			const counts = await Product.find(q).countDocuments();
			return res.status(200).json({
				success: response ? true : false,
				counts,
				products: response ? response : "Lấy danh sachs thất bại",
			});
		});
	});

	// [PUT] /:pid
	updateProduct = asyncHandler(async (req, res) => {
		const { pid } = req.params;
		const {
			name,
			price,
			description,
			category,
			brand,
			quantity,
			color,
			ram,
			internalMemory,
			defaultImages,
			defaultThumb,
			discount,
		} = req.body;
		if (
			!name ||
			!price ||
			!description ||
			!category ||
			!brand ||
			!quantity ||
			!color ||
			!ram ||
			!internalMemory
		) {
			throw new Error("Missing inputs");
		}

		const files = req?.files;

		let thumb;
		let images;

		if (defaultThumb) {
			thumb = defaultThumb;
		} else {
			thumb = files?.thumb[0].path;
		}

		if (defaultImages) {
			if (files?.images) {
				const imagesNew = files?.images?.map((el) => el.path);
				images = defaultImages.concat(imagesNew);
			} else {
				images = defaultImages;
			}
		} else {
			images = files?.images?.map((el) => el.path);
		}

		const payload = {
			name,
			slugify: slugify(name),
			category,
			brand,
			description,
			color,
			ram,
			internalMemory,
			quantity,
			price,
			thumb,
			images,
			discount,
		};

		const updatedProduct = await Product.findByIdAndUpdate(pid, payload, {
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

	// [PUT] /variants-update/:pid/:sku
	updateVariantsProduct = asyncHandler(async (req, res) => {
		const { pid, sku } = req.params;
		const {
			color,
			price,
			quantity,
			ram,
			internalMemory,
			discount,
			defaultThumbnail,
		} = req.body;

		if (
			!color ||
			!price ||
			!quantity ||
			!ram ||
			!internalMemory ||
			!discount
		) {
			throw new Error("Missing input");
		}

		let thumbnail = defaultThumbnail;
		if (req?.file) {
			thumbnail = req.file.path;
		}

		const product = await Product.findById(pid);

		const productUpdate = product.variants.find((item) => item.sku === sku);

		if (productUpdate) {
			await Product.updateOne(
				{
					variants: { $elemMatch: productUpdate },
				},
				{
					$set: {
						"variants.$.color": color,
						"variants.$.ram": ram,
						"variants.$.internalMemory": internalMemory,
						"variants.$.price": price,
						"variants.$.thumbnail": thumbnail,
						"variants.$.discount": discount,
						"variants.$.quantity": quantity,
					},
				},
				{ new: true }
			);
			return res.status(200).json({
				success: true,
				mes: "Cập nhật biến thể thành công",
			});
		} else {
			return res.status(200).json({
				success: false,
				mes: "Cập nhật biến thể thất bại",
			});
		}
	});

	// [PUT] /variants/:pid
	addVariantsProduct = asyncHandler(async (req, res) => {
		const { pid } = req.params;
		const { color, price, quantity, ram, internalMemory } = req.body;

		const thumb = req?.files?.thumb[0]?.path;

		if ((!color || !price || !thumb, !ram || !internalMemory)) {
			throw new Error("Missing input");
		}
		const response = await Product.findByIdAndUpdate(
			pid,
			{
				$push: {
					variants: {
						sku: uuid(),
						color,
						price,
						thumbnail: thumb,
						quantity,
						ram,
						internalMemory,
					},
				},
			},
			{ new: true }
		);
		return res.status(200).json({
			success: response ? true : false,
			data: response ? response : "Cannot add variants product",
		});
	});

	// [DELETE] /variants-delete/:pid/:sku
	deleteVariantsProduct = asyncHandler(async (req, res) => {
		const { sku, pid } = req.params;

		const response = await Product.findByIdAndUpdate(
			pid,
			{
				$pull: {
					variants: {
						sku,
					},
				},
			},
			{ new: true }
		);
		return res.status(200).json({
			success: response ? true : false,
			data: response ? response : "Cannot delete variants product",
		});
	});

	// [PUT] /update-sold
	updateSold = asyncHandler(async (req, res) => {
		const { arrProduct, state } = req.body;
		if (!arrProduct) throw new Error("Missing inputs");

		// state = 0 là người dùng mua hàng
		// state = 1 là người dùng hủy, hoàn hàng
		if (state === 0) {
			arrProduct.forEach(async (product) => {
				const findProduct = await Product.findById(product.pid);

				if (findProduct) {
					if (findProduct?._id.toString() === product.sku) {
						await Product.findByIdAndUpdate(
							findProduct._id,
							{
								$inc: { sold: product.quantity },
								$set: {
									quantity:
										findProduct.quantity - product.quantity,
								},
							},
							{ new: true }
						);
					} else {
						const getVariants = findProduct?.variants?.filter(
							(item) =>
								item.sku.toString() === product.sku.toString()
						);

						getVariants?.forEach((item) => {
							item.sold = item.sold + product.quantity;
							item.quantity = item.quantity - product.quantity;
							findProduct.save();
						});
					}
				}
			});
		} else {
			arrProduct.forEach(async (product) => {
				const findProduct = await Product.findById(product.pid);

				if (findProduct) {
					if (findProduct?._id.toString() === product.sku) {
						await Product.findByIdAndUpdate(
							findProduct._id,
							{
								$inc: { quantity: product.quantity },
								$set: {
									sold: findProduct.sold - product.quantity,
								},
							},
							{ new: true }
						);
					} else {
						const getVariants = findProduct?.variants?.filter(
							(item) =>
								item.sku.toString() === product.sku.toString()
						);

						getVariants?.forEach((item) => {
							item.sold = item.sold - product.quantity;
							item.quantity = item.quantity + product.quantity;
							findProduct.save();
						});
					}
				}
			});
		}
		return res.status(200).json({
			success: true,
			mes: "Cập nhật lượt bán thành công",
		});
	});
	// [PUT] /update-quantity
	updateQuantity = asyncHandler(async (req, res) => {
		const { arrProduct } = req.body;
		if (!arrProduct) throw new Error("Missing inputs");

		arrProduct.forEach(async (product) => {
			const findProduct = await Product.findById(product.pid);

			if (findProduct._id === product.pid) {
				await Product.findByIdAndUpdate(
					findProduct._id,
					{
						$inc: { sold: product.quantity },
					},
					{ new: true }
				);
			} else {
				const getVariants = findProduct.variants.filter(
					(item) => item.sku.toString() === product.sku.toString()
				);

				getVariants.forEach((item) => {
					item.sold = item.sold + product.quantity;
					findProduct.save();
				});
			}
		});
		return res.status(200).json({
			success: true,
			mes: "Cập nhật số lượng thành công",
		});
	});
}

module.exports = new ProductControllers();
