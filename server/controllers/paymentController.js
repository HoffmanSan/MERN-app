// IMPORTS
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

// STRIPE CHECKOUT SESSION
const createCheckoutSession = async (req, res) => {
  try {
    const user = req.user;
    const cartItems = [];

    await Promise.all(
      req.body.map(async (item) =>{
        const product = await Product.findOne({ _id: item.cartItemId });

        return cartItems.push({
          name: product.name,
          price: product.price,
          quantity: item.cartItemQuantity
        });
      })
    );

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
    });


    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.API_SERVER_URI}api/payments/payment-successful?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URI}failure`,
      client_reference_id: user.cartId
    });

    res.status(200).json({ url: session.url });
  }
  catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
};

// PAYMENT SUCCESSFUL
const paymentSuccessful = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    const userCartId = session.client_reference_id;
    const userCart = await Cart.findOne({ _id: userCartId });

    await Promise.all(
      userCart.cartItems.map(async (item) => {
        await Product.findOneAndUpdate(
          { _id: item.cartItemId },
          { $inc: { "inStock": (item.cartItemQuantity * -1) } }
        )
      })
    )
    .then(async () => {
      await Cart.findOneAndUpdate(
        { _id: userCartId },
        { cartItems: [] }
      )
    });

    res.status(302).redirect(`${process.env.CLIENT_URI}/success`);
  }
  catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
};

module.exports = { createCheckoutSession, paymentSuccessful};