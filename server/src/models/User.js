const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { type } = require("os");

const userSchema = new mongoose.Schema(
	{
		image: {
			type: String,
		},

		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phone: {
			type: String,
			unique: true,
		},
		password: {
			type: String,
		},
		role: {
			type: Number,
			enum: [1978, 1974],
			default: 1978,
		},
		cart: [
			{
				product: { type: mongoose.Types.ObjectId, ref: "Product" },
				sku: String,
				thumbnail: String,
				quantity: Number,
				color: String,
				price: Number,
				ram: String,
				internalMemory: String,
			},
		],
		address: {
			address: String,
			detail: String,
		},
		wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
		isBlocked: {
			type: Boolean,
			default: false,
		},
		refreshToken: {
			type: String,
		},
		passwordChangeAt: {
			type: String,
		},
		passwordResetExpires: {
			type: Date,
		},
		registerTokenExpires: {
			type: Date,
		},
		codeVerified: {
			type: String,
			default: null,
		},
		codeForgotPassword: {
			type: String,
			default: null,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		userGoogleId: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = bcrypt.genSaltSync(+process.env.KEY_SALT);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods = {
	isCorrectPassword: async function (password) {
		return await bcrypt.compare(password, this.password);
	},
};

//Export the model
module.exports = mongoose.model("User", userSchema);
