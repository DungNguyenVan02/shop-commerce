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
			console.log(decode);
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

module.exports = verifyAccessToken;
