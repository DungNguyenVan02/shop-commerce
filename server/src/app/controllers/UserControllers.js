const Users = require("../models/Users");
const asyncHandler = require("express-async-handler");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
class UserControllers {
	register = asyncHandler(async (req, res, next) => {
		const { firstName, lastName, email, passWord } = req.body;
		if (!firstName || !lastName || !email || !passWord) {
			return res.status(403).json({
				success: false,
				mes: "Missing required fields",
			});
		}

		const user = await Users.findOne({ email });
		if (user) {
			throw new Error("Email has existed!");
		} else {
			const newUser = await Users.create(req.body);
			return res.status(200).json({
				success: newUser ? true : false,
				mes: newUser
					? "Register is successfully!"
					: "Something went wrong",
			});
		}
	});

	login = asyncHandler(async (req, res, next) => {
		const { email, passWord } = req.body;
		if (!email || !passWord) {
			return res.status(403).json({
				success: false,
				mes: "Missing required fields",
			});
		}

		const response = await Users.findOne({ email });
		if (response && (await response.isCorrectPassword(passWord))) {
			const { passWord, role, ...userData } = response.toObject();
			// create access token and refresh token
			const accessToken = generateAccessToken(response._id, role);
			const refreshToken = generateRefreshToken(response._id);
			// save refresh token in database
			await Users.findByIdAndUpdate(
				response._id,
				{ refreshToken },
				{ new: true }
			);
			// save refresh token in cookie
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});
			// refresh token => cấp mới access token khi hết hạn
			// access token => xác thực người dùng, phân quyền
			return res.status(200).json({
				success: true,
				accessToken,
				data: userData,
			});
		} else {
			throw new Error("Invalid credentials");
		}
	});

	getCurrent = asyncHandler(async (req, res, next) => {
		const { _id } = req.user;
		const user = await Users.findById(_id).select(
			"-refreshToken -passWord -role"
		);
		return res.status(200).json({
			success: user ? true : false,
			res: user ? user : "User not found",
		});
	});

	refreshAccessToken = asyncHandler(async (req, res, next) => {
		// get token from cookie
		const cookie = req.cookies;
		if (!cookie && !cookie.refreshToken) {
			throw new Error("Invalid refresh token in cookies");
		}
		const rs = await jwt.verify(cookie.refreshToken, process.env.KEY_JWT);

		const response = await Users.findOne({
			_id: rs._id,
			refreshToken: cookie.refreshToken,
		});

		return res.status(200).json({
			success: response ? true : false,
			newAccessToken: response
				? generateAccessToken(response._id, response.role)
				: "Refresh token not matched",
		});
	});

	logout = asyncHandler(async (req, res, next) => {
		const cookie = req.cookies;
		if (!cookie || !cookie.refreshToken) {
			throw new Error("Invalid refresh token in cookies");
		}
		// Xóa refresh token ở db
		await Users.findOneAndUpdate(
			{ refreshToken: cookie.refreshToken },
			{ refreshToken: "" },
			{ new: true }
		);

		// Xóa refresh token
		res.clearCookie("refreshToken", { httpOnly: true, secure: true });

		return res.status(200).json({
			success: true,
			mes: "logout successfully",
		});
	});

	show(req, res, next) {
		Users.find({})
			.then((response) => res.json(response))
			.catch(next);
	}
}

module.exports = new UserControllers();
