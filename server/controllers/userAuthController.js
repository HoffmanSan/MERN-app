// Imports
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// LOGIN user
const loginUser = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.login(email, password);

    // Create a token
    const token = createToken(user._id);

    res.status(200).json({email, token, role: user.role, cartId: user.cartId});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// SIGNUP User
const signupUser = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.signup(email, password);

    // Create a token
    const token = createToken(user._id);

    res.status(200).json({email, token, role: user.role, cartId: user.cartId});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

module.exports = {
  loginUser,
  signupUser
};