// IMPORTS
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema ({
  name: {
    type: String,
    required: true,
    unique: true
  },
  imageURL: {
    type: String,
    required: true
  },
  cloudinaryFolderId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Category", categorySchema);