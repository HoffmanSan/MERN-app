const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser')

// Import routes
const productRoutes = require("./routes/productRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");
const imageRoutes = require("./routes/imageRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// Express App
const app = express();

// Middleware
app.use(bodyParser.json({ limit: '4mb' }))
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  console.log(req.headers["content-length"])
  next();
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/user-auth", userAuthRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);


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

