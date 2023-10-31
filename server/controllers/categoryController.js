// Imports
const Category = require("../models/categoryModel");
const mongoose = require("mongoose");

// Get all categories
const getCategories = async (req, res) => {
  const categories = await Category.find({});

  res.status(200).json(categories);
};

// Create a new category
const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const category = await Category.create({name});
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "Nie ma takiej kategorii"});
  }

  const category = await Category.findOneAndDelete({_id: id});

  if (!category) {
    return res.status(404).json({error: "Nie ma takiej kategorii"});
  }

  res.status(200).json({category});
};

// Update a category
const updateCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "Nie ma takiej kategorii"});
  }

  const category = await Category.findOneAndUpdate(
    { _id: id },
    { ...req.body },
    { new: true }
  );

  if (!category) {
    return res.status(404).json({error: "Nie ma takiej kategorii"});
  }

  res.status(200).json({category});
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory
};