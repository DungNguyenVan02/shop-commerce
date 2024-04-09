const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
class MessageControllers {
	addChat = asyncHandler(async (req, res) => {
		const { senderId, chatId, text } = req.body;

		const response = await Message.create({
			chatId,
			senderId,
			text,
		});

		return res.status(200).json({
			success: response ? true : false,
			data: response,
		});
	});

	getMessage = asyncHandler(async (req, res) => {
		const { chatId } = req.params;

		const response = await Message.find({
			chatId,
		});

		return res.status(200).json({
			success: response ? true : false,
			data: response,
		});
	});
}

module.exports = new MessageControllers();
