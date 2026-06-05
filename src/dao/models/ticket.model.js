const mongoose = require("mongoose");

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema(
  {
    // Código único de la compra
    code: { type: String, required: true, unique: true },
    // Fecha y hora de la compra
    purchase_datetime: { type: Date, default: Date.now },
    // Monto total de la compra
    amount: { type: Number, required: true },
    // Identificación del comprador (email)
    purchaser: { type: String, required: true },
    // Detalle de los productos comprados
    products: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
          title: String,
          quantity: Number,
          price: Number,
        },
      ],
      default: [],
    },
  },
  { versionKey: false }
);

const TicketModel = mongoose.model(ticketCollection, ticketSchema);

module.exports = TicketModel;
