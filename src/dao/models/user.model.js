const mongoose = require("mongoose");

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    index: true,
    require: true,
  },
  last_name: String,
  email: { type: String, require: true, unique: true },
  age: Number,
  role: {
    type: String,
    enum: ["USER", "ADMIN", "PREMIUM"],
    default: "USER",
  },
  password: {
    type: String,
    required: true,
  },
  last_connection: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cart",
  },
});

userSchema.pre("findOne", function () {
  this.populate("cart", " _id");
});

const userModel = mongoose.model(usersCollection, userSchema);

module.exports = userModel;
