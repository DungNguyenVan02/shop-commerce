const express = require("express");
const userControllers = require("../controllers/UserControllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.post("/logout", userControllers.logout);
router.get("/current", verifyAccessToken, userControllers.getCurrent);
router.post("/refreshtoken", userControllers.refreshAccessToken);
router.get("/forgotpassword", userControllers.forgotPassword);
router.put("/resetpassword", userControllers.resetPassWord);

router.get("/", verifyAccessToken, isAdmin, userControllers.getUsers);
router.delete("/", verifyAccessToken, isAdmin, userControllers.deleteUser);
router.put(
	"/:uid",
	verifyAccessToken,
	isAdmin,
	userControllers.updateUserByAdmin
);
router.put("/current", verifyAccessToken, userControllers.updateUser);

module.exports = router;
