// IMPORTS
const express = require("express");
const requireAdminAuth = require("../middleware/requireAdminAuth");

// CONTROLLERS
const {
  uploadImage,
  deleteImage
} = require("../controllers/imageController");

// ROUTES
const router = express.Router();

// MIDDLEWARE
router.use(requireAdminAuth);

// UPLOAD A NEW IMAGE
router.post("/", uploadImage);

// DELETE AN IMAGE
router.delete("/:folder/:id", deleteImage);

module.exports = router;