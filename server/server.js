const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser')
const { uploadImage } = require("./controllers/uploadImagesController");

// Import routes
const productRoutes = require("./routes/products");
const userAuthRoutes = require("./routes/usersAuth");

// Express App
const app = express();

// Middleware
app.use(bodyParser.json({ limit: '4mb' }))
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/user-auth", userAuthRoutes);

// TEST
app.post("/uploadImage", (req, res) => {
  uploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.send(err));
})

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

