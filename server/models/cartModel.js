// Imports
const mongoose = require("mongoose")

const Schema = mongoose.Schema

const cartSchema = new Schema({
  cartItems: [{
    _id: false,
    cartItemId: {
      type: String
    },
    cartItemQuantity: {
      type: Number
    }
  }]
})

module.exports = mongoose.model("Cart", cartSchema);