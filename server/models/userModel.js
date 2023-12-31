// IMPORTS
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Cart = require("./cartModel");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Administrator", "Użytkownik"],
    required: true
  },
  cartId: {
    type: String,
    required: true
  }
}, { timestamps: true });

// STATIC SIGNUP METHOD
userSchema.statics.signup = async function(email, password) {
  
  // validation
  if (!email || !password) {
    throw Error("Należy wypełnić wszystkie pola");
  }
  if (!validator.isEmail(email)) {
    throw Error("Nieprawidłowy format adresu e-mail");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error ("Hasło nie jest wystarczająco silne");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Konto z tym adresem e-mail już istnieje");
  }

  // signup process
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const cart = await Cart.create({});
  const user = await this.create({ email, password: hash, role: "Użytkownik", cartId: cart._id });

  return user;
};

// STATIC LOGIN METHOD
userSchema.statics.login = async function(email, password) {

  // validation
  if (!email || !password) {
    throw Error("Należy wypełnić wszystkie pola");
  }
  if (!validator.isEmail(email)) {
    throw Error("Nieprawidłowy format adresu e-mail");
  }

  // login process
  const user = await this.findOne({ email });

  if (!user) {
   throw Error("Nieprawidłowy adres e-mail lub hasło");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Nieprawidłowy adres e-mail lub hasło");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);