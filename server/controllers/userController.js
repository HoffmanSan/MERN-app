// Imports
const User = require("../models/userModel");
const mongoose = require("mongoose");

// Get all users
const getUsers = async (req, res) => {
  const users = await User.find({}).sort({createdAt: -1});

  res.status(200).json(users);
};

// Get a single user
const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "No such user."});
  }

  const user = await User.findById(id)

  if (!user) {
    return res.status(404).json({error: "No such user."});
  }

  res.status(200).json(user)
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "No such user."});
  }

  const user = await User.findOneAndDelete({_id: id});

  if (!user) {
    return res.status(404).json({error: "No such user."});
  }

  res.status(200).json({user});
};

module.exports = {
  getUser,
  getUsers,
  deleteUser
};