const express = require("express");
const blogControllers = require("../controllers/BlogControllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const router = express.Router();

router.get("/", verifyAccessToken, blogControllers.getAllBlog);
router.get("/:bid", verifyAccessToken, blogControllers.getBlog);

router.put("/like/:bid", verifyAccessToken, blogControllers.likeBlog);
router.put("/dislike/:bid", verifyAccessToken, blogControllers.dislikeBlog);

router.use(verifyAccessToken, isAdmin);

router.post("/", blogControllers.createBlog);
router.put("/:bid", blogControllers.updateBlog);
router.delete("/:bid", blogControllers.deleteBlog);

module.exports = router;
