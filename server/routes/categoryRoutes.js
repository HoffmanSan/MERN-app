// Imports
const express = require("express");
const requireAdminAuth = require("../middleware/requireAdminAuth");

// Controller functions
const {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory
} = require("../controllers/categoryController");

// Routes
const router = express.Router();

// GET all categories
router.get("/", getCategories);

// POST a new category
router.post("/", requireAdminAuth, createCategory);

// DELETE a category
router.delete("/:id", requireAdminAuth, deleteCategory);

// UPDATE a category
router.patch("/:id", requireAdminAuth, updateCategory);

module.exports = router;