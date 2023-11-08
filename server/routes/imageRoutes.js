// Imports
const express = require("express");
const requireAdminAuth = require("../middleware/requireAdminAuth");

// Controller functions
const {
  uploadImage,
  deleteImage
} = require("../controllers/imageController");

// Routes
const router = express.Router();

// Middleware
router.use(requireAdminAuth);

// POST a new image
router.post("/", uploadImage);

// DELETE an image
router.delete("/:folder/:id", deleteImage)

module.exports = router;