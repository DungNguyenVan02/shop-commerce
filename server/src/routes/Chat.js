const express = require("express");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const chatControllers = require("../controllers/ChatControllers");
const router = express.Router();

router.post("/", verifyAccessToken, chatControllers.createChat);
router.get("/:userId", verifyAccessToken, chatControllers.userChat);
router.get(
	"/find/:firstId/:secondId",
	verifyAccessToken,
	chatControllers.findChat
);

module.exports = router;
