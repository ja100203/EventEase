const express = require("express");
const { createOrder, verifyPayment, getAllPayments } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const { userOnly } = require("../middleware/userMiddleware");

const router = express.Router();

router.post("/create-payment", protect,userOnly, createOrder); // Users create order
router.post("/verify-payment", protect, verifyPayment); // Payment verification
router.get("/all", protect, adminOnly, getAllPayments); // Admin fetches all payments

module.exports = router;
