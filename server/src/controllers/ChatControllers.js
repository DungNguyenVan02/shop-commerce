const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
class ChatControllers {
	createChat = asyncHandler(async (req, res) => {
		const { senderId } = req.body;

		const receiverId = process.env.ADMIN_ID;

		const response = await Chat.create({
			members: [senderId, receiverId],
		});

		return res.status(200).json({
			success: response ? true : false,
			data: response,
		});
	});

	userChat = asyncHandler(async (req, res) => {
		const { userId } = req.params;

		const response = await Chat.find({
			members: { $in: [userId] },
		});

		return res.status(200).json({
			success: response ? true : false,
			data: response,
		});
	});

	findChat = asyncHandler(async (req, res) => {
		const { firstId, secondId } = req.params;

		const response = await Chat.find({
			members: { $all: [firstId, secondId] },
		});

		return res.status(200).json({
			success: response ? true : false,
			data: response,
		});
	});
}

module.exports = new ChatControllers();
