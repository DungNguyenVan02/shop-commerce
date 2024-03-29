const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},

		description: {
			type: String,
			required: true,
		},
		views: {
			type: Number,
			default: 0,
		},
		likes: [
			{
				type: mongoose.Types.ObjectId,
				ref: "User",
			},
		],
		dislikes: [
			{
				type: mongoose.Types.ObjectId,
				ref: "User",
			},
		],
		image: {
			type: String,
			default:
				"https://static7.depositphotos.com/1006899/750/i/450/depositphotos_7508833-stock-photo-person-write-to-blog.jpg",
		},
		author: {
			type: String,
			default: "Admin",
		},
	},
	{
		timestamps: true,
	}
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
