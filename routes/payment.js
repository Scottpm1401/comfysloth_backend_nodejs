const express = require("express");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const router = express.Router();
const User = require("../models/Users");

router.post("/", async (req, res) => {
  let { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "comfysloth company",
      payment_method: id,
      confirm: true,
    });
    const today = new Date();
    const date = `${
      today.getMonth() + 1
    } ${today.getDate()} ${today.getFullYear()}`;
    const purchaseForm = {
      _id: payment.id,
      status: payment.status,
      billing_details: req.body.billing_details,
      products: req.body.cart,
      total_bill: req.body.total,
      date: date,
      payment_method: payment.charges.data[0].payment_method_details.card.brand,
    };
    const newPurchase = await User.updateOne(
      { _id: req.body.user_id },
      { $push: { purchase: purchaseForm } }
    );
    const newCookie = JSON.parse(req.session.user);
    newCookie.purchase.push(purchaseForm);
    req.session.user = JSON.stringify(newCookie);
    res.json({
      message: "Payment successful",
      success: true,
      status: payment.status,
      purchaseForm,
      ok: newPurchase.ok,
    });
  } catch (err) {
    console.log(err);
    res.json({ message: "Payment failed", success: false });
  }
});

module.exports = router;
