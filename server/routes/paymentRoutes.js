// Imports
const express = require("express");
const requireUserAuth = require("../middleware/requireUserAuth")

// Controllers
const {
  checkoutSession
} = require("../controllers/paymentController")

// Routes
const router = express.Router();

// Middleware
router.use(requireUserAuth)

// CREATE new checkout session
router.post("/create-checkout-session", checkoutSession);

module.exports = router;