const express = require("express");

const productControllers = require("../controllers/ProductControllers");
const uploader = require("../config/cloudinary");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", productControllers.getAllProduct);
router.get("/:pid", productControllers.getProduct);
router.put("/ratings", verifyAccessToken, productControllers.ratings);

router.use(verifyAccessToken, isAdmin);
router.post("/", productControllers.createProduct);
router.put("/:pid", productControllers.updateProduct);
router.delete("/:pid", productControllers.deleteProduct);
router.put(
	"/upload-images/:pid",
	uploader.array("images", 10),
	productControllers.uploadImageProduct
);

module.exports = router;
