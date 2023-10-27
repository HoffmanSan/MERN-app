// Imports
const express = require("express");
const requireAuth = require("../middleware/requireAuth");

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
router.post("/", requireAuth, createCategory);

// DELETE a category
router.delete("/:id", requireAuth, deleteCategory);

// UPDATE a category
router.patch("/:id", requireAuth, updateCategory);

module.exports = router;