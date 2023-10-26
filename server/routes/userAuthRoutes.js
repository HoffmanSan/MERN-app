// Imports
const express = require("express");

// Controller functions
const {
  loginUser,
  signupUser
} = require ("../controllers/userAuthController");

// Routes
const router = express.Router();

// LOGIN route
router.post("/login", loginUser);

// SIGNUP route
router.post("/signup", signupUser);

module.exports = router;