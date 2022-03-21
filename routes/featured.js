const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const featured = await Product.find()
      .sort({ available: -1, stars: -1, reviews: -1, price: -1 })
      .limit(3);
    res.json(featured);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
