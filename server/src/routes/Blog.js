const express = require("express");
const blogControllers = require("../controllers/BlogControllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary");
const router = express.Router();

router.get("/", verifyAccessToken, blogControllers.getAllBlog);
router.get("/:bid", verifyAccessToken, blogControllers.getBlog);

router.put("/like/:bid", verifyAccessToken, blogControllers.likeBlog);
router.put("/dislike/:bid", verifyAccessToken, blogControllers.dislikeBlog);

router.use(verifyAccessToken, isAdmin);

router.post("/", blogControllers.createBlog);
router.put("/:bid", blogControllers.updateBlog);
router.put(
	"/upload-image/:bid",
	uploader.single("image"),
	blogControllers.uploadImageBlog
);
router.delete("/:bid", blogControllers.deleteBlog);

module.exports = router;
