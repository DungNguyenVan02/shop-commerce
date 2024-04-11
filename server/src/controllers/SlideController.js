const asyncHandler = require("express-async-handler");
const Slide = require("../models/Slide");
class SlideControllers {
	// [GET] /
	getSlides = asyncHandler(async (req, res) => {
		const response = await Slide.find();
		return res.status(200).json({
			success: response ? true : false,
			data: response ? response : "Slide empty!",
		});
	});

	// [POST] /
	createSlides = asyncHandler(async (req, res) => {
		const images = req.files?.images?.map((el) => el.path);

		const payload = {
			images: images,
		};
		await Slide.remove();

		const response = await Slide.create(payload);
		return res.json({
			success: response ? true : false,
			data: response ? response : "Cannot create new Slide !",
		});
	});

	// [PUT]
	updateSlides = asyncHandler(async (req, res) => {
		const { sid, defaultImages } = req.body;

		let images;
		if (defaultImages) {
			if (req?.files?.images) {
				const newImages = req.files?.images?.map((el) => el.path);

				images = defaultImages.concat(newImages);
			} else {
				images = defaultImages;
			}
		} else {
			images = req.files?.images?.map((el) => el.path);
		}

		const response = await Slide.findByIdAndUpdate(
			sid,
			{ images: images },
			{
				new: true,
			}
		);

		return res.status(200).json({
			success: true,
			data: response ? response : "Cannot update Slide !",
		});
	});
}

module.exports = new SlideControllers();
