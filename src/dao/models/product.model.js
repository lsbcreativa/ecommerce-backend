const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productCollection = "products";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true, default: 0 },
    category: { type: String, required: true, index: true },
    thumbnails: { type: [String], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Plugin que agrega el método .paginate() => devuelve docs, totalPages,
// prevPage, nextPage, hasPrevPage, hasNextPage, etc.
productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model(productCollection, productSchema);

module.exports = ProductModel;
