const express = require("express");
const uploader = require("../config/cloudinary");

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const slideController = require("../controllers/SlideController");
const router = express.Router();

router.get("/", slideController.getSlides);

router.use(verifyAccessToken, isAdmin);

router.post(
	"/",
	uploader.fields([
		{
			name: "images",
			maxCount: 10,
		},
	]),
	slideController.createSlides
);
router.put(
	"/",
	uploader.fields([
		{
			name: "images",
			maxCount: 10,
		},
	]),
	slideController.updateSlides
);

module.exports = router;
