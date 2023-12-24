const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
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
			type: String,
			default: "user",
		},
		cart: [
			{
				product: { type: mongoose.Types.ObjectId, ref: "Product" },
				quantity: Number,
				color: String,
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
		passwordResetToken: {
			type: String,
		},
		passwordResetExpires: {
			type: String,
		},
		registerTokenExpires: {
			type: Date,
		},
		codeVerified: {
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
	createPassWordChangeToken: function () {
		const resetToken = crypto.randomBytes(64).toString("hex");
		this.passwordResetToken = crypto
			.createHash("sha256")
			.update(resetToken)
			.digest("hex");
		this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
		return resetToken;
	},
};

//Export the model
module.exports = mongoose.model("User", userSchema);
