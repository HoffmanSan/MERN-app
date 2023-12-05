// IMPORTS
const express = require("express");
const requireAdminAuth = require("../middleware/requireAdminAuth");

// CONTROLLERS
const {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// ROUTES
const router = express.Router();

// MIDDLEWARE
router.use(requireAdminAuth);

// GET ALL USERS
router.get("/", getUsers);

// GET A SINGLE USER
router.get("/:id", getUser);

// UPDATE A USER
router.patch("/:id", updateUser);

// DELETE A USER
router.delete("/:id", deleteUser);

module.exports = router;