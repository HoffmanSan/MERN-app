// IMPORTS
const Product = require("../models/productModel");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

// STRIPE CHECKOUT SESSION
const checkoutSession = async (req, res) => {
  console.log(req.user.cartId)

  try {
    const user = req.user
    const cartItems = []

    await Promise.all(
      req.body.map(async (item) =>{
        const product = await Product.findOne({ _id: item.cartItemId })

        return cartItems.push({
          name: product.name,
          price: product.price,
          quantity: item.cartItemQuantity
        })
      })
    )

    const lineItems = cartItems.map(item => {
      return {
        price_data: {
          currency: "pln",
          product_data: {
            name: item.name
          },
          unit_amount: item.price*100,
        },
        quantity: item.quantity,
      }
    })


    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `http://127.0.0.1:4000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://www.facebook.com`,
      client_reference_id: user.cartId
    })

    res.status(200).json({ url: session.url })
  }
  catch (error) {
    console.log(error)
    res.status(400).json({error: error.message})
  }
}

module.exports = { checkoutSession }