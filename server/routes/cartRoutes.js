// IMPORTS
const express = require("express");
const requireUserAuth = require("../middleware/requireUserAuth");

// CONTROLLERS
const { getCart, updateCart } = require("../controllers/cartController");

// ROUTES
const router = express.Router();

// MIDDLEWARE
router.use(requireUserAuth);

// GET A SINGLE CART
router.get("/:id", getCart);

// UPDATE A CART
router.patch("/:id", updateCart);

module.exports = router;