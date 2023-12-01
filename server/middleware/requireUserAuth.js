// IMPORTS
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const requireUserAuth = async (req, res, next) => {

  // Verify authentication
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ error: "Odrzucono zapytanie z powodu braku tokena uwierzytelniania" })
  }

  const token = authorization.split(" ")[1]

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findOne({ _id })
    
    next()

  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message })
  }
}

module.exports = requireUserAuth