// Imports
const Cart = require("../models/cartModel")
const User = require("../models/userModel")
const mongoose = require("mongoose")

// GET A SINGLE CART
const getCart = async (req, res) => {
  const { id } = req.params
  const user = req.user
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "Nieprawidłowy numer identyfikacyjny wózka"});
  }

  // deny request if the user is trying to access someone else's cart
  if (user.cartId !== id) {
    return res.status(401).json({error: "Odrzucono zapytanie o dane z powodu braku uprawnień"})
  }
  
  const cart = await Cart.findOne({ _id: id })

  res.status(200).json(cart)
}
 
// UPDATE CART CONTENT
const updateCart = async (req, res) => {
  const { id } = req.params
  const { cartId, cartItems } = req.body
  const user = req.user

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "Nieprawidłowy numer identyfikacyjny wózka"});
  }

  // deny request if the user is trying to access someone else's cart
  if (user.cartId !== id) {
    return res.status(401).json({error: "Odrzucono zapytanie o dane z powodu braku uprawnień"})
  }
  console.log(req.body)

  const updatedCart = Cart.findOneAndUpdate(
    { _id: user.cartId },
    { ...req.body },
    { new: true }
  )

  res.status(200).json({updatedCart})
}

module.exports = { getCart, updateCart }