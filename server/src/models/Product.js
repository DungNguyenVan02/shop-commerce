const mongoose = require("mongoose"); // Erase if already required

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
			trim: true,
			lowercase: true,
		},
		description: {
			type: String,
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
			type: mongoose.Types.ObjectId,
			ref: "Category",
		},
		quantity: {
			type: Number,
			default: 0,
		},
		sole: {
			type: Number,
			default: 0,
		},
		image: {
			type: Array,
		},
		color: {
			type: String,
			enum: ["Black", "White", "Red", "Green"],
		},
		ratings: [
			{
				star: { type: Number },
				postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
				Comment: { type: String },
			},
		],
		totalRatings: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
