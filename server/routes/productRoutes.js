// IMPORTS
const express = require("express");
const requireAdminAuth = require("../middleware/requireAdminAuth");

// CONTROLLERS
const {
  getProduct,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct
} = require("../controllers/productController");

// ROUTES
const router = express.Router();

// GET ALL PRODUCTS
router.get("/", getProducts);

// GET A SINGLE PRODUCT
router.get("/:id", getProduct);

// CREATE A NEW PRODUCT
router.post("/", requireAdminAuth, createProduct);

// DELETE A PRODUCT
router.delete("/:id", requireAdminAuth, deleteProduct);

// UPDATE A PRODUCT
router.patch("/:id", requireAdminAuth, updateProduct);

module.exports = router;