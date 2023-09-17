const express = require("express");
const userControllers = require("../app/controllers/UserControllers");

const router = express.Router();

router.post("/register", userControllers.register);
router.get("/show", userControllers.show);

module.exports = router;
