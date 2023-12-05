// IMPORTS
const express = require("express");
const requireUserAuth = require("../middleware/requireUserAuth");

// CONTROLLERS
const {
  createCheckoutSession,
  paymentSuccessful
} = require("../controllers/paymentController");

// ROUTES
const router = express.Router();

// CREATE NEW CHECKOUT SESSION
router.post("/create-checkout-session", requireUserAuth, createCheckoutSession);

// SUCCESSFUL PAYMENT
router.get("/payment-successful", paymentSuccessful);

module.exports = router;