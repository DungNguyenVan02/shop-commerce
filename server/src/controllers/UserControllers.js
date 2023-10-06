const Users = require("../models/User");
const asyncHandler = require("express-async-handler");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../ultils/sendMail");
const crypto = require("crypto");

class UserControllers {
	// [POST] /register
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

	// [POST] /login
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
			const { passWord, role, refreshToken, ...userData } =
				response.toObject();
			// create access token and refresh token
			const accessToken = generateAccessToken(response._id, role);
			const newRefreshToken = generateRefreshToken(response._id);
			// save refresh token in database
			await Users.findByIdAndUpdate(
				response._id,
				{ newRefreshToken },
				{ new: true }
			);
			// save refresh token in cookie
			res.cookie("refreshToken", newRefreshToken, {
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

	// [POST] /logout
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

	getCurrent = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const user = await Users.findById(_id).select(
			"-refreshToken -passWord -role"
		);
		return res.status(200).json({
			success: user ? true : false,
			res: user ? user : "User not found",
		});
	});

	// [POST] /refreshtoken
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

	// client gửi lên email đăng ký
	// Server check nếu đúng email đăng ký ? gửi mail + link có password change token : Thông báo email không đc dăng ký
	// client xem mail và click vào link gửi kèm
	// Link kèm 1 api gửi ngược password change token lên server
	// server check có đúng với token gửi kèm theo mail cho client không
	// đúng thì cho đổi và ngược lại

	// [GET] /forgotpassword?email=...
	forgotPassword = asyncHandler(async (req, res, next) => {
		const { email } = req.query;
		if (!email) {
			throw new Error("Invalid email");
		}
		const user = await Users.findOne({ email });
		if (!user) {
			throw new Error("User not found");
		}

		const resetToken = user.createPassWordChangeToken();
		await user.save();

		const html = `Xin vui lòng click vào link dưới đây để lấy lại mật khẩu của bạn. Link này sẽ hết hạn sau 15 phút kể từ bây giờ <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>click here</a>`;

		const data = {
			email,
			html,
		};

		const rs = await sendMail(data);
		return res.status(200).json({
			success: true,
			rs,
		});
	});

	// [PUT] /resetpassword
	resetPassWord = asyncHandler(async (req, res, next) => {
		const { passWord, token } = req.body;
		if (!passWord || !token) {
			throw new Error("Missing inputs");
		}
		const passWordResetToken = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");
		const user = await Users.findOne({
			passWordResetToken,
			passWordResetExpires: { $gt: Date.now() },
		});

		if (!user) {
			throw new Error("Invalid reset token");
		}

		user.passWord = passWord;
		user.passWordChangeAt = Date.now();
		user.passWordResetToken = undefined;
		user.passWordResetExpires = undefined;
		await user.save();
		return res.status(200).json({
			success: user ? true : false,
			mes: user ? "Updated password" : "Something went wrong",
		});
	});

	// [GET] /
	getUsers = asyncHandler(async (req, res) => {
		const response = await Users.find().select(
			"-refreshToken -passWord -role"
		);
		return res.status(200).json({
			success: response ? true : false,
			users: response,
		});
	});
	// [DELETE] ?_id=....
	deleteUser = asyncHandler(async (req, res) => {
		const { _id } = req.query;
		if (!_id) {
			throw new Error("Missing inputs");
		}
		const response = await Users.findByIdAndDelete(_id);
		return res.status(200).json({
			success: response ? true : false,
			deletedUser: response
				? `User with email ${response.email}`
				: "No user delete",
		});
	});

	// [PUT] /current
	updateUser = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		if (!_id || Object.keys(req.body).length === 0) {
			throw new Error("Missing inputs");
		}
		const response = await Users.findByIdAndUpdate(_id, req.body, {
			new: true,
		}).select("-refreshToken -passWord -role");
		return res.status(200).json({
			success: response ? true : false,
			updatedUser: response ? response : "some thing went wrong",
		});
	});

	// [PUT] /:slug(_id)
	updateUserByAdmin = asyncHandler(async (req, res) => {
		const { role } = req.user;
		const { uid } = req.params;
		if (role !== "admin") {
			throw new Error("You must be an admin");
		}
		if (!uid || Object.keys(req.body).length === 0) {
			throw new Error("Missing inputs");
		}
		const response = await Users.findByIdAndUpdate(uid, req.body, {
			new: true,
		}).select("-refreshToken -passWord -role");
		return res.status(200).json({
			success: response ? true : false,
			updatedUser: response ? response : "some thing went wrong",
		});
	});
}

module.exports = new UserControllers();
