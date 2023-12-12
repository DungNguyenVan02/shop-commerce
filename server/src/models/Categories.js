const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		brand: {
			type: Array,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

//Export the model
module.exports = mongoose.model("Categories", categorySchema);
