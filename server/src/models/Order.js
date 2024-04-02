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
				ram: String,
				internalMemory: String,
			},
		],
		status: {
			type: String,
			default: "Đang xử lý",
			enum: [
				"Đang xử lý",
				"Giao hàng thành công",
				"Đang giao hàng",
				"Hoàn trả đơn hàng",
				"Hủy đơn hàng",
			],
		},
		isPayed: {
			type: Boolean,
			default: false,
		},
		bankCode: String,
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
