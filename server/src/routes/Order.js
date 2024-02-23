const express = require("express");
const orderControllers = require("../controllers/OrderControllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const router = express.Router();

router.put("/status/:oid", verifyAccessToken, orderControllers.updateStatus);
router.put(
	"/confirm/:oid",
	verifyAccessToken,
	isAdmin,
	orderControllers.confirmReturn
);
router.delete("/delete/:oid", verifyAccessToken, orderControllers.deleteOrder);
router.get("/return-order", verifyAccessToken, orderControllers.getReturnOrder);
router.get(
	"/history-order",
	verifyAccessToken,
	orderControllers.getUserHistoryOrder
);

router.get("/admin", verifyAccessToken, isAdmin, orderControllers.getOrders);
router.get(
	"/admin/canceled",
	verifyAccessToken,
	isAdmin,
	orderControllers.getOrderCanceled
);
router.get(
	"/admin/return-refund",
	verifyAccessToken,
	isAdmin,
	orderControllers.getOrderReturn
);
router.post("/", verifyAccessToken, orderControllers.createOrder);
router.get("/", verifyAccessToken, orderControllers.getUserOrder);

module.exports = router;
