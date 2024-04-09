const express = require("express");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const messageControllers = require("../controllers/MessageControllers");
const router = express.Router();

router.post("/", verifyAccessToken, messageControllers.addChat);
router.get("/:chatId", verifyAccessToken, messageControllers.getMessage);

module.exports = router;
