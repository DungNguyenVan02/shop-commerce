const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
	{
		image: {
			type: String,
		},
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
		phone: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: Number,
			enum: [1978, 1974],
			default: 1978,
		},
		cart: [
			{
				product: { type: mongoose.Types.ObjectId, ref: "Product" },
				thumbnail: String,
				quantity: Number,
				color: String,
				price: Number,
			},
		],
		address: {
			type: Array,
			default: [],
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
