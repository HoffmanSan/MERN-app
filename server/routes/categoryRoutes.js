// IMPORTS
const express = require("express");
const requireAdminAuth = require("../middleware/requireAdminAuth");

// CONTROLLERS
const {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory
} = require("../controllers/categoryController");

// ROUTES
const router = express.Router();

// GET ALL CATEGORIES
router.get("/", getCategories);

// POST A NEW CATEGORY
router.post("/", requireAdminAuth, createCategory);

// DELETE A CATEGORY
router.delete("/:id", requireAdminAuth, deleteCategory);

// UPDATE A CATEGORY
router.patch("/:id", requireAdminAuth, updateCategory);

module.exports = router;