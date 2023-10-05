const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

// Import routes
const productRoutes = require("./routes/products");
const userAuthRoutes = require("./routes/usersAuth");

// Express App
const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/user-auth", userAuthRoutes);

// Connect to database
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Connected to db and listening on port " + process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  })

