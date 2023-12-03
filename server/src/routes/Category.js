const express = require("express");

const categoryControllers = require("../controllers/CategoryControllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", categoryControllers.getAllCategory);

router.use(verifyAccessToken, isAdmin);
router.post("/", categoryControllers.createCategory);
router.put("/:cid", categoryControllers.updateCategory);
router.delete("/:cid", categoryControllers.deleteCategory);

module.exports = router;
