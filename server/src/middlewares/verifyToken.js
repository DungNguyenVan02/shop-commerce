const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyAccessToken = asyncHandler(async (req, res, next) => {
	if (req?.headers?.authorization?.startsWith("Bearer")) {
		const token = req.headers.authorization.split(" ")[1];
		jwt.verify(token, process.env.KEY_JWT, (err, decode) => {
			if (err) {
				return res.status(401).json({
					success: false,
					mes: "Invalid access token",
				});
			}
			req.user = decode;
			next();
		});
	} else {
		return res.status(401).json({
			success: false,
			mes: "Required authentication!",
		});
	}
});

const isAdmin = asyncHandler(async (req, res, next) => {
	const { role } = req.user;
	if (+role !== 1974) {
		return res.status(401).json({
			success: false,
			mes: "You must be an admin",
		});
	}
	next();
});

module.exports = {
	verifyAccessToken,
	isAdmin,
};
