const Product = require("../models/Product");
const Categories = require("../models/Categories");
const asyncHandler = require("express-async-handler");
const dataProduct = require("../data/ecommerce.json");
const dataCategory = require("../data/category");
const generateSlug = require("../ultils/slugify");

const ram = ["4 GB", "8 GB", "16 GB", "32 GB"];
const internalMemory = ["32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 T"];

const fn = async (product) => {
	await Product.create({
		name: product?.name,
		slug: generateSlug(product?.name),
		description: product?.description,
		brand: product?.brand,
		price: Math.round(Number(product?.price?.match(/\d/g).join("")) / 100),
		category: product?.category,
		quantity: Math.round(Math.random() * 1000),
		sold: Math.round(Math.random() * 300),
		color: product?.variants?.find((el) => el.label === "Color")
			?.variants[0],
		thumb: product?.thumb,
		images: product?.images,
		totalRatings: 0,
		ram: ram[Math.floor(Math.random() * 4)],
		internalMemory: internalMemory[Math.floor(Math.random() * 6)],
	});
};

const fnCate = async (category) => {
	await Categories.create({
		name: category?.cate,
		slug: generateSlug(category?.cate),
		brand: category?.brand,
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
