const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  img: {
    type: String,
    default: "https://i.ibb.co/wJGwHYW/default-user-avatar.jpg",
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  birthday: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, default: "" },
  sex: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  cart: { type: [Object], default: [] },
  purchase: { type: [Object], default: [] },
  cart_total: { type: Number, default: 0 },
  phone: { type: String, default: "" },
  admin: { type: Boolean, default: false },
});

module.exports = mongoose.model("Users", UserSchema);
