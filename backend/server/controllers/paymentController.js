const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");  // Import Notification model
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");

dotenv.config();

console.log(process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create a new payment order
const createOrder = async (req, res) => {
  try {
    const { bookingId, amount, currency } = req.body;

    console.log("🔹 Received Payment Request:", req.body);

    // Validate bookingId
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      console.log("❌ Invalid Booking ID Format");
      return res.status(400).json({ message: "Invalid booking ID format" });
    }

    // Fetch booking details
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.log("❌ Booking Not Found");
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("✅ Booking Found:", booking);

    // Check Razorpay keys
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.log("❌ Razorpay API keys missing");
      return res.status(500).json({ message: "Payment service unavailable" });
    }

    // Razorpay Order Options
    const options = {
      amount: 10000, // Convert to paise (1 INR = 100 paise)
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    console.log("🔹 Creating Razorpay Order with:", options);
    try {
      const order = await razorpay.orders.create(options);
      return res.status(200).json(order);
    } catch (error) {
      console.error("❌ Error while creating Razorpay order:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);  // Log the full error response
      }
      return res.status(500).json({
        message: "Order creation failed",
        error: error.response ? error.response.data : error.message,
      });
    }
    
    console.log("✅ Razorpay Order Created:", order);

    // Save payment record in database
    const newPayment = new Payment({
      user: req.user._id,
      booking: bookingId,
      transactionId: order.id,
      amount,
      currency,
      status: "pending",
    });

    await newPayment.save();
    console.log("✅ Payment Record Created:", newPayment);

    // 🔹 Create a Notification for Payment Initiation
    const newNotification = new Notification({
      user: req.user._id,
      event: booking.event,  // Assuming booking is linked to an event
      message: "Your payment process has started. Please complete the payment.",
      type: "payment_pending",
    });

    await newNotification.save();

    // 🔹 Emit real-time notification using Socket.io
    global.io.emit("receiveNotification", {
      user: req.user._id,
      message: "Your payment process has started. Please complete the payment.",
      type: "payment_pending",
    });

    // Return Razorpay order details as response
    res.status(200).json(order);
  } catch (error) {
    console.log("❌ Order Creation Failed:", error);
    res.status(500).json({ message: "Order creation failed", error });
  }
};

// ✅ Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Generate the signature to verify the payment
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      console.log("❌ Payment verification failed due to signature mismatch");
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Find the payment record in the database
    const payment = await Payment.findOneAndUpdate(
      { transactionId: razorpay_order_id },
      {
        status: "completed",
        razorpay_payment_id,
        razorpay_signature,
      },
      { new: true }
    );

    if (!payment) {
      console.log("❌ Payment record not found for order ID:", razorpay_order_id);
      return res.status(404).json({ message: "Payment record not found" });
    }

    // 🔹 Create a Notification for Payment Success
    const successNotification = new Notification({
      user: payment.user,
      message: "Your payment was successful! 🎉",
      type: "payment_success",
    });

    await successNotification.save();

    // 🔹 Emit real-time notification using Socket.io
    global.io.emit("receiveNotification", {
      user: payment.user,
      message: "Your payment was successful! 🎉",
      type: "payment_success",
    });

    res.status(200).json({ message: "Payment verified successfully", payment });
  } catch (error) {
    console.error("❌ Payment Verification Failed:", error);
    res.status(500).json({ message: "Payment verification failed", error });
  }
};

// ✅ Get all payments (Admin Only)
const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate("user", "name email")  // Populate user info (optional)
    .populate("booking", "event date")  // Populate booking info (optional)
    .sort({ createdAt: -1 });  // Optional: Sort payments by creation date

  res.status(200).json(payments);
});

module.exports = { createOrder, verifyPayment, getAllPayments };
