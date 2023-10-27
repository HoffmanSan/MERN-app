// Imports
const express = require("express");
const requireAuth = require("../middleware/requireAuth");

// Controller functions
const {
  getUser,
  getUsers,
  deleteUser,
} = require("../controllers/userController");

// Routes
const router = express.Router();

// Middleware
router.use(requireAuth);

// GET all users
router.get("/", getUsers);

// GET a single user
router.get("/:id", getUser);

// DELETE a product
router.delete("/:id", deleteUser);

module.exports = router;