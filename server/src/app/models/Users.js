const mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		mobile: {
			type: String,
			required: true,
			unique: true,
		},
		passWord: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: "user",
		},
		cart: {
			type: Array,
			default: [],
		},
		address: [{ type: mongoose.Types.ObjectId, ref: "Address" }],
		wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
		isBlocked: {
			type: Boolean,
			default: false,
		},
		refreshToken: {
			type: String,
		},
		passWordChangeAt: {
			type: String,
		},
		passWordResetToken: {
			type: String,
		},
		passWordResetExpires: {
			type: String,
		},
	},
	{ timestamps: true }
);

//Export the model
module.exports = mongoose.model("User", userSchema);
