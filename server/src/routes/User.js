const express = require("express");
const userControllers = require("../controllers/UserControllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/register", userControllers.register);
router.put("/completedregister", userControllers.completedRegister);
router.post("/login", userControllers.login);
router.post("/logout", userControllers.logout);
router.post("/refreshtoken", userControllers.refreshAccessToken);
router.post("/forgotpassword", userControllers.forgotPassword);
router.put("/resetpassword", userControllers.resetPassWord);

router.put("/address", verifyAccessToken, userControllers.updateAddress);
router.put("/address/:adr", verifyAccessToken, userControllers.deleteAddress);
router.get("/current", verifyAccessToken, userControllers.getCurrent);
router.put("/current", verifyAccessToken, userControllers.updateUser);
router.put("/cart", verifyAccessToken, userControllers.updateCart);

router.put(
	"/:uid",
	verifyAccessToken,
	isAdmin,
	userControllers.updateUserByAdmin
);

router.get("/", verifyAccessToken, isAdmin, userControllers.getUsers);
router.delete("/:uid", verifyAccessToken, isAdmin, userControllers.deleteUser);

module.exports = router;
