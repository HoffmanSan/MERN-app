// Imports
const express = require("express");
const requireAuth = require("../middleware/requireAuth");

// Controller functions
const {
  getProduct,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct
} = require("../controllers/productController");

// Routes
const router = express.Router();

// GET all products
router.get("/", getProducts);

// GET a single product
router.get("/:id", getProduct);

// POST a new product
router.post("/", requireAuth, createProduct);

// DELETE a product
router.delete("/:id", requireAuth, deleteProduct);

// UPDATE a product
router.patch("/:id", requireAuth, updateProduct);

module.exports = router;