const mongoose = require("mongoose"); // Erase if already required
mongoose.set("strictQuery", false);
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			// unique: true,
			trim: true,
			lowercase: true,
		},
		description: {
			type: Array,
			required: true,
			trim: true,
		},
		brand: {
			type: String,
			required: true,
			trim: true,
		},
		price: {
			type: Number,
			required: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},
		quantity: {
			type: Number,
			default: 0,
		},
		sold: {
			type: Number,
			default: 0,
		},

		thumb: {
			type: String,
			required: true,
		},
		images: {
			type: Array,
		},
		color: {
			type: String,
		},
		ratings: [
			{
				star: { type: Number },
				postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
				comment: { type: String },
				date: { type: String },
				time: { type: String },
			},
		],
		totalRatings: {
			type: Number,
			default: 0,
		},
		variants: [
			{
				sku: String,
				color: String,
				price: Number,
				thumb: String,
				quantity: { type: Number, default: 0 },
			},
		],
	},
	{
		timestamps: true,
	}
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
