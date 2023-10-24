const express = require("express");

const brandControllers = require("../controllers/BrandControllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", verifyAccessToken, brandControllers.getBrands);

router.use(verifyAccessToken, isAdmin);
router.post("/", brandControllers.createBrand);
router.put("/:bid", brandControllers.updateBrand);
router.delete("/:bid", brandControllers.deleteBrand);

module.exports = router;
