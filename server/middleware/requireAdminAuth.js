// IMPORTS
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// REQUIRE ADMIN
const requireAdminAuth = async (req, res, next) => {

  // verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Odrzucono zapytanie z powodu braku tokena uwierzytelniania" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findOne({ _id });
    
    if (req.user.role !== "Administrator") {
      return res.status(401).json({ error: "Odrzucono zapytanie z powodu braku uprawnień administratora" })
    }
    
    next();

  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

module.exports = requireAdminAuth;