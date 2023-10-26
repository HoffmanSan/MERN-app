// Imports
const express = require("express");

// Controller functions
const {
  getUser,
  getUsers,
  deleteUser,
} = require("../controllers/userController");

// Routes
const router = express.Router();

// GET all users
router.get("/", getUsers);

// GET a single user
router.get("/:id", getUser);

// DELETE a product
router.delete("/:id", deleteUser);

module.exports = router;