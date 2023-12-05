// IMPORTS
const Category = require("../models/categoryModel");
const mongoose = require("mongoose");

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
  const categories = await Category.find({});

  res.status(200).json(categories);
};

// CREATE A NEW CATEGORY
const createCategory = async (req, res) => {
  const { name, imageURL, cloudinaryFolderId } = req.body;

  try {
    const category = await Category.create({name, imageURL, cloudinaryFolderId});
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// DELETE A CATEGORY
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "Nieprawidłowy numer identyfikacyjny kategorii"});
  }

  const category = await Category.findOneAndDelete({_id: id});

  if (!category) {
    return res.status(404).json({error: "Nie ma takiej kategorii"});
  }

  res.status(200).json({category});
};

// UPDATE A CATEGORY
const updateCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "Nieprawidłowy numer identyfikacyjny kategorii"});
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