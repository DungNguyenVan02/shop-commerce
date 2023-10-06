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
		const products = await Products.find();
		return res.status(200).json({
			success: products ? true : false,
			productsData: products ? products : "Cannot get products",
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
}

module.exports = new ProductControllers();
