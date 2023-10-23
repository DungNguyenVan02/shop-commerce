const express = require("express");

const blogCategoryControllers = require("../controllers/BlogCategoryControllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", verifyAccessToken, blogCategoryControllers.getAllBlogCategory);

router.use(verifyAccessToken, isAdmin);
router.post("/", blogCategoryControllers.createBlogCategory);
router.put("/:bcid", blogCategoryControllers.updateBlogCategory);
router.delete("/:bcid", blogCategoryControllers.deleteBlogCategory);

module.exports = router;
