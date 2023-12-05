// IMPORTS
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const mongoose = require("mongoose");

// GET ALL USERS
const getUsers = async (req, res) => {
  const users = await User.find({}).sort({createdAt: -1});

  res.status(200).json(users);
};

// GET A SINGLE USER
const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "Nieprawidłowy numer identyfikacyjny użytkownika"});
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({error: "Nie ma takiego użytkownika"});
  }

  res.status(200).json(user);
};

// UPDATE A USER
const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "Nieprawidłowy numer identyfikacyjny użytkownika"});
  }

  const user = await User.findOneAndUpdate(
    { _id: id },
    { ...req.body },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({error: "Nie ma takiego użytkownika"});
  }

  res.status(200).json({user});
};

// DELETE A USER
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "Nieprawidłowy numer identyfikacyjny użytkownika"});
  }

  const user = await User.findOneAndDelete({_id: id});

  await Cart.findOneAndDelete({ _id: user.cartId});

  if (!user) {
    return res.status(404).json({error: "Nie ma takiego użytkownika"});
  }

  res.status(200).json({user});
};

module.exports = {
  getUser,
  getUsers,
  updateUser,
  deleteUser
};