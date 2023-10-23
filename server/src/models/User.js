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

userSchema.pre("save", async function (next) {
	if (!this.isModified("passWord")) {
		next();
	}
	const salt = bcrypt.genSaltSync(+process.env.KEY_SALT);
	this.passWord = await bcrypt.hash(this.passWord, salt);
});

userSchema.methods = {
	isCorrectPassword: async function (passWord) {
		return await bcrypt.compare(passWord, this.passWord);
	},
	createPassWordChangeToken: function () {
		const resetToken = crypto.randomBytes(64).toString("hex");
		this.passWordResetToken = crypto
			.createHash("sha256")
			.update(resetToken)
			.digest("hex");
		this.passWordResetExpires = Date.now() + 15 * 60 * 1000;
		return resetToken;
	},
};

//Export the model
module.exports = mongoose.model("User", userSchema);
