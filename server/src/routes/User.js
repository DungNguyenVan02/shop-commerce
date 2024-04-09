const express = require("express");
const userControllers = require("../controllers/UserControllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary");

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
router.put(
	"/current",
	verifyAccessToken,
	uploader.single("avatar"),
	userControllers.updateUser
);
router.put("/cart", verifyAccessToken, userControllers.updateCart);
router.put(
	"/update-quantity",
	verifyAccessToken,
	userControllers.updateQuantityCart
);
router.delete("/remove-cart", verifyAccessToken, userControllers.removeCart);

router.put(
	"/:uid",
	verifyAccessToken,
	isAdmin,
	userControllers.updateUserByAdmin
);
router.get("/:uid", verifyAccessToken, isAdmin, userControllers.getUserById);

router.put("/wishlist/:pid", verifyAccessToken, userControllers.wishList);

router.get("/", verifyAccessToken, isAdmin, userControllers.getUsers);
router.delete("/:uid", verifyAccessToken, isAdmin, userControllers.deleteUser);

module.exports = router;
