const express = require("express");

const productControllers = require("../controllers/ProductControllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

router.put("/ratings", verifyAccessToken, productControllers.ratings);

router.use(verifyAccessToken, isAdmin);

router.post("/", productControllers.createProduct);
router.get("/", productControllers.getAllProduct);
router.put("/:pid", productControllers.updateProduct);
router.delete("/:pid", productControllers.deleteProduct);
router.get("/:pid", productControllers.getProduct);

module.exports = router;
