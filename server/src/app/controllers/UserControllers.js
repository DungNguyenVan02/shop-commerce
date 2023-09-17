const User = require("../models/Users");

class UserControllers {
	register(req, res, next) {
		const { firstName, lastName, email, passWord } = req.body;
		if (!firstName || !lastName || !email || !passWord) {
			return res.status(403).json({
				success: false,
				mes: "Missing required fields",
			});
		}
		const users = User.create(req.body);
		users.then((response) => res.json(response)).catch(next);
	}

	show(req, res, next) {
		User.find({})
			.then((response) => res.json(response))
			.catch(next);
	}
}

module.exports = new UserControllers();
