// Imports
const express = require("express");
const requireAuth = require("../middleware/requireAuth");

// Controller functions
const {
  getUser,
  getUsers,
  updateUser,
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

// UPDATE a user
router.patch("/:id", updateUser)

// DELETE a user
router.delete("/:id", deleteUser);

module.exports = router;