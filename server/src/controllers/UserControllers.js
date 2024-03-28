const User = require("../models/User");
const sendMail = require("../ultils/sendMail");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../middlewares/jwt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");

//Hàm xóa các toàn khoản không xác thực
const scheduleAccountCleanup = () => {
	cron.schedule("*/60 * * * *", async () => {
		try {
			const expiredUsers = await User.find({
				isVerified: false,
				registerTokenExpires: { $lt: new Date() },
			});
			if (expiredUsers.length > 0) {
				for (const user of expiredUsers) {
					await user.remove();
				}
			}
		} catch (error) {
			console.error("Lỗi khi xóa tài khoản hết hạn:", error);
		}
	});
};

class UserControllers {
	// [POST] /register
	register = asyncHandler(async (req, res, next) => {
		const { fullName, phone, email, password } = req.body;
		if (!fullName || !phone || !email || !password) {
			return res.status(403).json({
				success: false,
				mes: "Missing required fields",
			});
		}
		await User.deleteOne({ phone, isVerified: false });

		const user = await User.findOne({ email, phone });

		if (user) {
			throw new Error("User has existed!");
		} else {
			const emailToken = await jwt.sign({ email }, process.env.KEY_JWT, {
				expiresIn: "59m",
			});
			let codeRand;

			codeRand = Math.floor(Math.random() * 90000) + 10000;

			const verificationExpires = new Date();
			verificationExpires.setMinutes(
				verificationExpires.getMinutes() + 59
			);

			const codeVerified = await User.find({
				codeVerified: { $ne: null },
			});

			let isExsitedCode = codeVerified.find(
				(item) => item.codeVerified === codeRand
			);
			do {
				codeRand = Math.floor(Math.random() * 90000) + 10000;
				isExsitedCode = codeVerified.find(
					(item) => item.codeVerified === codeRand
				);
			} while (isExsitedCode);

			await User.create({
				...req.body,
				email: emailToken,
				codeVerified: codeRand,
				registerTokenExpires: verificationExpires,
			});

			const html = `<h3>Your encryption authentication: </br><blockquote>${codeRand}</blockquote></h3>`;

			const rs = await sendMail({
				email,
				html,
				subject: "Completed registration in the digital world",
			});

			scheduleAccountCleanup();

			return res.json({
				success: rs.response?.includes("OK") ? true : false,
				codeVerified: rs.response?.includes("OK") ? codeVerified : "",
				mes: rs.response?.includes("OK")
					? "Please check your email to accept registration"
					: "Something went wrong, please try again",
			});
		}
	});

	// [POST] /completedregister
	completedRegister = asyncHandler(async (req, res) => {
		const { codeVerified } = req.body;

		const user = await User.findOne({
			codeVerified: codeVerified,
			registerTokenExpires: { $gt: new Date() },
		});

		if (user !== null) {
			const emailDecode = await jwt.verify(
				user.email,
				process.env.KEY_JWT
			);
			const response = await User.findByIdAndUpdate(
				user?._id,
				{
					email: emailDecode.email,
					isVerified: true,
					codeVerified: null,
				},
				{ new: true }
			);
			return res.json({
				success: response ? true : false,
				mes: response
					? "Account authentication successful"
					: "Something went wrong",
			});
		} else {
			await User.deleteOne({ codeVerified });
			return res.json({
				success: false,
				mes: "Something went wrong",
			});
		}
	});

	// [POST] /login
	login = asyncHandler(async (req, res, next) => {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(403).json({
				success: false,
				mes: "Missing required fields",
			});
		}

		const response = await User.findOne({ email, isVerified: true });
		if (!response) {
			throw new Error("Cannot find user, please try again");
		}
		if (response.isBlocked) {
			throw new Error(
				"Your account has been locked, please contact the administrator!"
			);
		}
		if (await response.isCorrectPassword(password)) {
			const { password, refreshToken, ...userData } = response.toObject();
			// create access token and refresh token
			const accessToken = generateAccessToken(
				response._id,
				userData.role
			);
			const newRefreshToken = generateRefreshToken(response._id);

			// save refresh token in database
			const rs = await User.findByIdAndUpdate(
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
				success: rs ? true : false,
				mes: rs ? "Login successfully" : "Something went wrong",
				accessToken,
				data: userData,
			});
		} else {
			throw new Error("Account or password is incorrect");
		}
	});

	// [POST] /logout
	logout = asyncHandler(async (req, res, next) => {
		const cookie = req.cookies;
		if (!cookie || !cookie.refreshToken) {
			throw new Error("Invalid refresh token in cookies");
		}
		// Xóa refresh token ở db
		await User.findOneAndUpdate(
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
		console.log(_id);
		const user = await User.findById(_id)
			.select("-refreshToken -password")
			.populate({
				path: "cart",
				populate: {
					path: "product",
					select: "name quantity",
				},
			})
			.populate("wishlist", "name thumb price color _id");
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

		const response = await User.findOne({
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
		const { email } = req.body;
		if (!email) {
			throw new Error("Invalid email");
		}
		const user = await User.findOne({ email });
		if (!user) {
			throw new Error("User not found");
		}

		let codeRand;

		codeRand = Math.floor(Math.random() * 90000) + 10000;

		const passwordResetExpires = new Date();
		passwordResetExpires.setMinutes(passwordResetExpires.getMinutes() + 15);

		const codeForgotPassword = await User.find({
			codeForgotPassword: { $ne: null },
		});

		let isExsitedCode = codeForgotPassword.find(
			(item) => item.codeForgotPassword === codeRand
		);
		do {
			codeRand = Math.floor(Math.random() * 90000) + 10000;
			isExsitedCode = codeForgotPassword.find(
				(item) => item.codeForgotPassword === codeRand
			);
		} while (isExsitedCode);

		const html = `<h3>Your encryption authentication: </br><blockquote>${codeRand}</blockquote></h3>`;

		const data = {
			email,
			html,
			subject: "Forgot password",
		};

		(user.codeForgotPassword = codeRand),
			(user.passwordResetExpires = passwordResetExpires),
			await user.save();

		const rs = await sendMail(data);
		return res.status(200).json({
			success: true,
			mes: rs.response?.includes("OK")
				? "Please check your email"
				: "Something went wrong! please try again",
		});
	});

	// [PUT] /resetpassword
	resetPassWord = asyncHandler(async (req, res, next) => {
		const { password, codeForgotPassword } = req.body;
		if (!password || !codeForgotPassword) {
			throw new Error("Missing inputs");
		}

		const user = await User.findOne({
			codeForgotPassword,
			passwordResetExpires: { $gt: Date.now() },
		});

		if (!user) {
			throw new Error("Invalid reset token");
		}

		user.password = password;
		user.passwordChangeAt = Date.now();
		user.codeForgotPassword = undefined;
		user.passwordResetExpires = undefined;
		await user.save();
		return res.status(200).json({
			success: user ? true : false,
			mes: user ? "Updated password" : "Something went wrong",
		});
	});

	// [GET] /
	getUsers = asyncHandler(async (req, res) => {
		const queries = { ...req.query };
		// Tách trường đặc biệt trên query
		const excludeFields = ["page", "sort", "limit", "fields"];
		// format lại các operators cho đúng cú pháp mongoose
		excludeFields.forEach((field) => delete queries[field]);

		let queryString = JSON.stringify(queries);
		queryString = queryString.replace(
			/\b(gte|gt|lte|lt)\b/g,
			(matchedEl) => {
				return `$${matchedEl}`;
			}
		);
		const formatQuery = JSON.parse(queryString);

		// Filtering
		if (queries?.q) {
			delete formatQuery.q;
			formatQuery["$or"] = [
				{ firstName: { $regex: queries.q, $options: "i" } },
				{ lastName: { $regex: queries.q, $options: "i" } },
				{ phone: { $regex: queries.q, $options: "i" } },
			];
		}

		const q = {
			...formatQuery,
		};

		let queryCommand = User.find(q);

		// Sorting
		if (req.query.sort) {
			const sortBy = req.query.sort.split(",").join(" ");
			queryCommand = queryCommand.sort(sortBy);
		}

		// Fields limiting
		if (req.query.fields) {
			const fields = req.query.fields.split(",").join(" ");
			queryCommand = queryCommand.select(fields);
		}
		// Pagination
		// limit: số object lấy về trong 1 lần gọi api
		// skip: số trang muốn bỏ qua
		const page = +req.query.page || 1;
		const limit = +req.query.limit || process.env.LIMIT;
		const skip = (page - 1) * limit;
		queryCommand.skip(skip).limit(limit);

		// execute query
		queryCommand.exec(async (err, response) => {
			if (err) throw new Error(err.message);
			const counts = await User.find(q).countDocuments();
			return res.status(200).json({
				success: response ? true : false,
				counts,
				data: response ? response : "Lấy danh sách thất bại",
			});
		});
	});
	// [DELETE] ?uid=....
	deleteUser = asyncHandler(async (req, res) => {
		const { uid } = req.params;

		const response = await User.findByIdAndDelete(uid);
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
		const { firstName, lastName, email, phone } = req.body;
		const payload = { firstName, lastName, email, phone };
		if (req.file) {
			payload.image = req.file.path;
		}
		if (!_id || Object.keys(req.body).length === 0) {
			throw new Error("Missing inputs");
		}
		const response = await User.findByIdAndUpdate(_id, payload, {
			new: true,
		}).select("-refreshToken -password -role");
		return res.status(200).json({
			success: response ? true : false,
			mes: response ? "Updated successfully" : "Some thing went wrong",
		});
	});

	// [PUT] /:slug(_id)
	updateUserByAdmin = asyncHandler(async (req, res) => {
		const { uid } = req.params;
		const { isBlocked } = req.body;

		if (!uid) {
			throw new Error("Missing inputs");
		}
		const response = await User.findByIdAndUpdate(
			uid,
			{ isBlocked },
			{
				new: true,
			}
		).select("-refreshToken -password -role");
		return res.status(200).json({
			success: response ? true : false,
			dataUpdate: response,
			updatedUser: response
				? "Cập nhật thông tin người dùng thành công!"
				: "Có lỗi xảy ra, vui lòng thử lại sau!",
		});
	});

	// [PUT] /address
	updateAddress = asyncHandler(async (req, res) => {
		const { _id } = req.user;

		if (!req.body.address) {
			throw new Error("Missing inputs");
		}

		const listAddress = await User.findById(_id).select("address");

		const alreadyAddress = listAddress.address.find(
			(item) => item === req.body.address
		);

		if (!alreadyAddress) {
			const response = await User.findByIdAndUpdate(
				_id,
				{ $push: { address: req.body.address } },
				{
					new: true,
				}
			).select("-refreshToken -password -role");
			return res.status(200).json({
				success: response ? true : false,
				mes: response
					? "Updated successfully!"
					: "some thing went wrong",
			});
		}
		return res.status(200).json({
			success: true,
			mes: "Updated successfully!",
		});
	});

	// [PUT] /address/:adr
	deleteAddress = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const { adr } = req.params;

		if (!adr) {
			throw new Error("Missing inputs");
		}

		const response = await User.findByIdAndUpdate(
			_id,
			{ $pull: { address: adr } },
			{
				new: true,
			}
		).select("-refreshToken -password -role");
		return res.status(200).json({
			success: response ? true : false,
			updatedUser: response ? response : "some thing went wrong",
		});
	});

	// [PUT] /cart
	updateCart = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const { pid, quantity = 1, color, price, thumbnail } = req.body;
		if (!pid || !color || !price || !thumbnail)
			throw new Error("Missing inputs");
		const cartUser = await User.findById(_id).select("cart");
		const alreadyProduct = cartUser?.cart?.find(
			(el) =>
				el.product.toString() === pid && el.color.toString() === color
		);
		if (alreadyProduct) {
			const response = await User.updateOne(
				{ cart: { $elemMatch: alreadyProduct } },
				{
					$set: {
						"cart.$.quantity": alreadyProduct.quantity + quantity,
						"cart.$.price": price,
						"cart.$.thumbnail": thumbnail,
					},
				},
				{ new: true }
			);

			return res.status(200).json({
				success: response ? true : false,
				mes: response
					? "Updated your cart successfully"
					: "some thing went wrong",
			});
		} else {
			const response = await User.findByIdAndUpdate(
				_id,
				{
					$push: {
						cart: {
							product: pid,
							quantity,
							color,
							price,
							thumbnail,
						},
					},
				},
				{ new: true }
			);

			return res.status(200).json({
				success: response ? true : false,
				mes: response
					? "Updated your cart successfully"
					: "some thing went wrong",
			});
		}
	});

	// [PUT] /update-quantity
	updateQuantityCart = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const { pid } = req.params;
		const { color, quantity } = req.body;
		if (!pid || !color || !quantity) throw new Error("Missing inputs");
		const cartUser = await User.findById(_id).select("cart");
		const alreadyProduct = cartUser?.cart?.find(
			(el) =>
				el.product.toString() === pid && el.color.toString() === color
		);
		if (alreadyProduct) {
			const response = await User.updateOne(
				{ cart: { $elemMatch: alreadyProduct } },
				{
					$set: {
						"cart.$.quantity": quantity,
					},
				},
				{ new: true }
			);

			return res.status(200).json({
				success: response ? true : false,
				mes: response
					? "Updated your cart successfully"
					: "some thing went wrong",
			});
		}

		return res.status(200).json({
			success: true,
			mes: "Cannot find product in cart",
		});
	});

	// [DELETE] /remove-cart
	removeCart = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const { arrProduct } = req.body;
		if (!arrProduct) throw new Error("Missing inputs");

		const response = await User.findByIdAndUpdate(
			_id,
			{
				$pull: {
					cart: { _id: { $in: [...arrProduct] } },
				},
			},
			{ new: true }
		);
		return res.status(200).json({
			success: response ? true : false,
			mes: response ? "Remove successfully" : "some thing went wrong",
		});
	});

	// [PUT] /wishlist/:pid
	wishList = asyncHandler(async (req, res) => {
		const { _id } = req.user;
		const { pid } = req.params;

		const user = await User.findById(_id);

		const alreadyWishlist = await user?.wishlist?.find(
			(wid) => wid.toString() === pid
		);
		if (alreadyWishlist) {
			const response = await User.findByIdAndUpdate(
				_id,
				{
					$pull: { wishlist: pid },
				},
				{ new: true }
			);

			return res.status(200).json({
				success: response ? true : false,
				mes: response
					? "Remove wishlist successfully!"
					: "something went wrong !!",
			});
		} else {
			const response = await User.findByIdAndUpdate(
				_id,
				{
					$push: { wishlist: pid },
				},
				{ new: true }
			);

			return res.status(200).json({
				success: response ? true : false,
				mes: response
					? "Add wishlist successfully!"
					: "something went wrong !!",
			});
		}
	});
}

module.exports = new UserControllers();
