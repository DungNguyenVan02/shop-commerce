const mongoose = require("mongoose");

async function connect() {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		if (conn.connection.readyState === 1) {
			console.log("Connect to database successfully!!!");
		} else {
			console.log("Connecting...");
		}
	} catch (error) {
		console.log("Connect to database fail!!!");
	}
}

module.exports = { connect };
