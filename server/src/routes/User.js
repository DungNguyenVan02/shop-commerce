const express = require("express");
const userControllers = require("../app/controllers/UserControllers");
const verifyAccessToken = require("../app/middlewares/verifyToken");

const router = express.Router();

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.post("/logout", userControllers.logout);
router.get("/current", verifyAccessToken, userControllers.getCurrent);
router.post("/refreshtoken", userControllers.refreshAccessToken);

router.get("/show", userControllers.show);

module.exports = router;
