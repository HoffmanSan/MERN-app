// Imports
const express = require("express");

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
router.post("/", createCategory);

// DELETE a category
router.delete("/:id", deleteCategory);

// UPDATE a category
router.patch("/:id", updateCategory);

module.exports = router;