// Imports
const express = require("express");

// Controller functions
const {
  uploadImage,
  deleteImage
} = require("../controllers/imageController");

// Routes
const router = express.Router();

// POST a new image
router.post("/", uploadImage);

// DELETE an image
router.delete("/:id", deleteImage)

module.exports = router;