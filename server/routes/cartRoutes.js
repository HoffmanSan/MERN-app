// Imports
const express = require("express")
const requireUserAuth = require("../middleware/requireUserAuth")

// Controller functions
const { getCart, updateCart } = require("../controllers/cartController")

// Routes
const router = express.Router()

// Middleware
router.use(requireUserAuth)

// GET a single cart
router.get("/:id", getCart)

// UPDATE cart's content
router.patch("/:id", updateCart)

module.exports = router