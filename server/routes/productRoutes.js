// Imports
const express = require("express");
const requireAdminAuth = require("../middleware/requireAdminAuth");

// Controllers
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
router.post("/", requireAdminAuth, createProduct);

// DELETE a product
router.delete("/:id", requireAdminAuth, deleteProduct);

// UPDATE a product
router.patch("/:id", requireAdminAuth, updateProduct);

module.exports = router;