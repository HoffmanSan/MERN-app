// IMPORTS
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser')

// ROUTE IMPORTS
const productRoutes = require("./routes/productRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");
const imageRoutes = require("./routes/imageRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes")

// EXPRESS APP
const app = express();

// GENERAL MIDDLEWARE
app.use(cors({ origin: process.env.CLIENT_URI }));
app.use(bodyParser.json({ limit: '4mb' }))
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// ROUTES
app.use("/api/products", productRoutes)
app.use("/api/user-auth", userAuthRoutes)
app.use("/api/images", imageRoutes)
app.use("/api/users", userRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/carts", cartRoutes)

// CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Connected to db and listening on port " + process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  })

