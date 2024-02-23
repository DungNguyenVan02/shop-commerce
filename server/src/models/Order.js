const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
	{
		code: String,
		products: [
			{
				product: { type: mongoose.Types.ObjectId, ref: "Product" },
				thumbnail: String,
				quantity: Number,
				color: String,
				price: Number,
			},
		],
		status: {
			type: String,
			default: "Processing",
			enum: [
				"Processing",
				"Success",
				"Transported",
				"Return",
				"Canceled",
			],
		},
		isConfirmReturn: {
			type: Boolean,
			default: false,
		},
		address: String,
		total: Number,
		orderBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
		},
		method: String,
	},
	{
		timestamps: true,
	}
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
