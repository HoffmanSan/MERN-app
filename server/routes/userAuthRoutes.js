// IMPORTS
const express = require("express");

// CONTROLLERS
const {
  loginUser,
  signupUser
} = require ("../controllers/userAuthController");

// ROUTES
const router = express.Router();

// LOGIN
router.post("/login", loginUser);

// SIGNUP
router.post("/signup", signupUser);

module.exports = router;