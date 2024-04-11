const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var slideSchema = new mongoose.Schema(
	{
		images: Array,
	},
	{ timestamps: true }
);

//Export the model
module.exports = mongoose.model("Slide", slideSchema);
