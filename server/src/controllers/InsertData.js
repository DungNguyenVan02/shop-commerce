const Product = require("../models/Product");
const Categories = require("../models/Categories");
const asyncHandler = require("express-async-handler");
const dataProduct = require("../data/ecommerce.json");
const dataCategory = require("../data/category");
const slugify = require("slugify");
const fn = async (product) => {
	await Product.create({
		name: product?.name,
		slug: slugify(product?.name),
		description: product?.description,
		brand: product?.brand,
		price: Math.round(Number(product?.price?.match(/\d/g).join("")) / 100),
		category: product?.category,
		quantity: Math.round(Math.random() * 1000),
		sole: Math.round(Math.random() * 300),
		images: product?.images,
		color: product?.variants?.find((el) => el.label === "Color")
			?.variants[0],
		thumb: product?.thumb,
		totalRatings: 0,
	});
};

const fnCate = async (category) => {
	await Categories.create({
		name: category?.cate,
		slug: slugify(category?.cate),
		brand: category?.brand,
		image: category?.image,
	});
};

class InsertData {
	insertProduct = asyncHandler(async (req, res) => {
		const promise = [];
		for (let product of dataProduct) {
			promise.push(fn(product));
		}
		await Promise.all(promise);
		return res.json("Done");
	});

	insertCategory = asyncHandler(async (req, res) => {
		const promise = [];
		for (let category of dataCategory) {
			promise.push(fnCate(category));
		}
		await Promise.all(promise);
		return res.json("Done");
	});
}

module.exports = new InsertData();
