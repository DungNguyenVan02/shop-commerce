const express = require("express");

const couponControllers = require("../controllers/CouponControllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const router = express.Router();

router.get("/:cid", verifyAccessToken, couponControllers.getCoupon);

router.use(verifyAccessToken, isAdmin);

router.post("/", couponControllers.createCoupon);
router.get("/", couponControllers.getCoupons);
router.put("/:cid", couponControllers.updateCoupon);
router.delete("/:cid", couponControllers.deleteCoupon);

module.exports = router;
