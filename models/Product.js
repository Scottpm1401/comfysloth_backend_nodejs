const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  img: { type: String, required: true },
  gallery: { type: [String], default: undefined },
  title: { type: String, required: true },
  stars: { type: Number, default: 4 },
  reviews: { type: Number, default: 100 },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  available: { type: Boolean, default: true },
  sku: { type: String, required: true },
  brand: { type: String, required: true },
  colors: { type: [String], default: undefined },
  freeship: { type: Boolean, default: false },
});

module.exports = mongoose.model("Products", ProductSchema);
