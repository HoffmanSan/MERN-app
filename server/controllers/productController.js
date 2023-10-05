const Product = require("../models/productModel");
const mongoose = require("mongoose");

// Get all products
const getProducts = async (req, res) => {
  const products = await Product.find({}).sort({createdAt: -1});

  res.status(200).json(products);
};

// Get a single product
const getProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "No such product."});
  }

  const product = await Product.findById(id)

  if (!product) {
    return res.status(404).json({error: "No such product."});
  }

  res.status(200).json(product)
};

// Create a new product
const createProduct = async (req, res) => {
  const { title, price, category, description, inStock } = req.body;

  try {
    const product = await Product.create({title, category, price, description, inStock});
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "No such product."});
  }

  const product = await Product.findOneAndDelete({_id: id});

  if (!product) {
    return res.status(404).json({error: "No such product."});
  }

  res.status(200).json({product});
};

// Update a product
const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "No such product."});
  }

  const product = await Product.findOneAndUpdate(
    { _id: id },
    { ...req.body },
    { new: true }
  );

  if (!product) {
    return res.status(404).json({error: "No such product."});
  }

  res.status(200).json({product});
};

module.exports = {
  getProduct,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct
};