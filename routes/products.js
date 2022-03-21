const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const product = await Product.find();
    res.json(product);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  const product = new Product({
    img: req.body.img,
    gallery: req.body.gallery,
    title: req.body.title,
    stars: req.body.stars,
    reviews: req.body.reviews,
    category: req.body.category,
    price: req.body.price,
    description: req.body.description,
    available: req.body.available,
    sku: req.body.sku,
    brand: req.body.brand,
    color: req.body.color,
    freeship: req.body.freeship,
  });

  try {
    const savedProduct = await product.save();
    res.json(savedProduct);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    res.json(product);
  } catch (err) {
    res.json({ message: err });
  }
});

router.delete("/:productId", async (req, res) => {
  try {
    const removedProduct = await Product.remove({ _id: req.params.productId });
    res.json(removedProduct);
  } catch (err) {
    res.json({ message: err });
  }
});

router.patch("/:productId", async (req, res) => {
  try {
    const updatedProduct = await Product.updateOne(
      { _id: req.params.productId },
      { $set: { colors: req.body.colors } }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
