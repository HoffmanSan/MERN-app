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
  const { productId, productName, productPrice, productInStock, productImageUrl, purchaseQuantity } = req.body
  const user = req.user

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "Nieprawidłowy numer identyfikacyjny wózka"});
  }

  // deny request if the user is trying to access someone else's cart
  if (user.cartId !== id) {
    return res.status(401).json({error: "Odrzucono zapytanie o dane z powodu braku uprawnień"})
  }

  try {
    // check if item with this id is already in the cart
    const exists = await Cart.findOne(
      { cartItems: { $elemMatch: { productId: productId } } }
    )

    // delete item from cart if purchaseQuantity = 0
    if (purchaseQuantity === 0) {
      await Cart.updateOne(
        { _id: id },
        { $pull:
          { cartItems:
            { productId: productId }
          }
        }
      )

      return res.status(200).json("Usunięto przedmiot z wózka")
    }

    // update item if it already exists
    if (exists) {
      const updatedCartItem = await Cart.findOneAndUpdate(
        { _id: id },
        { $set: 
          {
            "cartItems.$[elem].productName" : productName,
            "cartItems.$[elem].productPrice" : productPrice,
            "cartItems.$[elem].productInStock" : productInStock,
            "cartItems.$[elem].productImageUrl" : productImageUrl,
            "cartItems.$[elem].purchaseQuantity" : purchaseQuantity
          }
        },
        { arrayFilters: 
          [ { "elem.productId": productId } ] 
        },
        { upsert: true },
        { returnDocument: "after" },
        { returnNewDocument: true }
      )

      return res.status(200).json(updatedCartItem)
    }
    
    // add item to cart if it doesn't exist yet
    if (!exists) {
      const newCartItem = await Cart.updateOne(
        { _id: id },
        { $push: 
          { cartItems:
            { 
              productId: productId,
              productName: productName,
              productPrice: productPrice,
              productInStock: productInStock,
              productImageUrl: productImageUrl,
              purchaseQuantity: purchaseQuantity
            } 
          }
        }
      )

      return res.status(200).json(newCartItem)
    }
  }
  catch (error) {
    res.status(404).json({ error: error.message })
  }
}

module.exports = { getCart, updateCart }