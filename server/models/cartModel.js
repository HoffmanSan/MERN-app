// Imports
const mongoose = require("mongoose")

const Schema = mongoose.Schema

const cartSchema = new Schema({
  cartItems: [{
    productId: {
      type: String
    },
    productName: {
      type: String
    },
    productPrice: {
      type: Number
    },
    productInStock: {
      type: Number
    },
    productImageUrl: {
      type: String
    },
    purchaseQuantity: {
      type: Number
    }
  }]
})

module.exports = mongoose.model("Cart", cartSchema);