const express = require("express");
const orderControllers = require("../controllers/OrderControllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const router = express.Router();

router.put(
	"/status/:oid",
	verifyAccessToken,
	isAdmin,
	orderControllers.updateStatus
);
router.delete(
	"/cancel-order/:oid",
	verifyAccessToken,
	orderControllers.cancelOrder
);

router.post("/", verifyAccessToken, orderControllers.createOrder);
router.get("/", verifyAccessToken, orderControllers.getUserOrder);
router.get("/admin", verifyAccessToken, isAdmin, orderControllers.getOrders);

module.exports = router;
