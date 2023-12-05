// IMPORTS
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  categories: {
    type: [String],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  inStock: {
    type: Number,
    required: true
  },
  photoURLs: {
    type: [String],
    required: true
  },
  cloudinaryFolderId: {
    type: String,
    required: true
  },
  // testField: {
  //   type: String,
  //   required: true
  // }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);