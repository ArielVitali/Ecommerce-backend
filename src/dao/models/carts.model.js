const mongoose = require("mongoose");

const cartCollection = "cart";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: Number,
      },
    ],
    default: [],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

cartSchema.pre("find", function () {
  this.populate("products.product", "title price stock");
});

cartSchema.pre("findOne", function () {
  this.populate("products.product", "title price stock");
});

cartSchema.pre("findOne", function () {
  this.populate("owner", "first_name email _id");
});

const Cart = mongoose.model(cartCollection, cartSchema);

module.exports = Cart;
