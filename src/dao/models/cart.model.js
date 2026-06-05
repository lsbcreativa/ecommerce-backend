const mongoose = require("mongoose");

const cartCollection = "carts";

const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          // Referencia al modelo products para poder usar .populate()
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required: true,
          },
          quantity: { type: Number, required: true, default: 1, min: 1 },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CartModel = mongoose.model(cartCollection, cartSchema);

module.exports = CartModel;
