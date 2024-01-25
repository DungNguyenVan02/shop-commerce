const express = require("express");

const productControllers = require("../controllers/ProductControllers");
const uploader = require("../config/cloudinary");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", productControllers.getAllProduct);
router.get("/:pid", productControllers.getProduct);
router.put("/ratings", verifyAccessToken, productControllers.ratings);

router.use(verifyAccessToken, isAdmin);
router.post(
	"/",
	uploader.fields([
		{
			name: "images",
			maxCount: 10,
		},
		{ name: "thumb", maxCount: 1 },
	]),
	productControllers.createProduct
);
router.put(
	"/variants/:pid",
	uploader.fields([
		{
			name: "images",
			maxCount: 10,
		},
		{ name: "thumb", maxCount: 1 },
	]),
	productControllers.addVariantsProduct
);
router.put(
	"/:pid",
	uploader.fields([
		{
			name: "images",
			maxCount: 10,
		},
		{ name: "thumb", maxCount: 1 },
	]),
	productControllers.updateProduct
);
router.delete("/:pid", productControllers.deleteProduct);
router.put(
	"/upload-images/:pid",
	uploader.array("images", 10),
	productControllers.uploadImageProduct
);

module.exports = router;
