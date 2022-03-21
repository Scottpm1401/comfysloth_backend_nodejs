const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  try {
    const Users = await User.find();
    res.json(Users);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const findUser = await User.find({ email: req.body.email });
    if (findUser.length > 0) {
      res.json({ message: "Email already existed" });
    } else {
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        birthday: req.body.birthday,
        password: hashPassword,
        admin: req.body.admin,
      });
      const savedUser = await user.save();
      res.json({
        message: "Your account has been created",
        loggedIn: true,
        user: { email: req.body.email, password: req.body.password },
        savedUser,
      });
    }
  } catch (err) {
    res.json({ messsage: err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (user.length > 0) {
      const compare = await bcrypt.compare(req.body.password, user[0].password);
      if (compare) {
        req.session.user = JSON.stringify(user[0]);
        res.json([{ loggedIn: true, user: user[0] }]);
      } else {
        res.json({ message: "Incorrect password" });
      }
    } else res.json({ message: "Invalid email or password" });
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/login", async (req, res) => {
  try {
    req.session.user
      ? res.json({ loggedIn: true, user: JSON.parse(req.session.user) })
      : res.json({ loggedIn: false });
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) throw err;
      res.json({ loggedIn: false });
    });
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/update/:userId", async (req, res) => {
  try {
    const { name, email, birthday, address, sex, city, state, phone } =
      req.body;
    const updatedUser = await User.updateOne(
      { _id: req.params.userId },
      { $set: { name, email, birthday, address, sex, city, state, phone } }
    );
    let newCookie = JSON.parse(req.session.user);
    newCookie = {
      ...newCookie,
      name,
      email,
      birthday,
      address,
      sex,
      city,
      state,
      phone,
    };
    req.session.user = JSON.stringify(newCookie);
    res.json({ message: "Your profile has been updated", updatedUser });
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/upload/:userId", async (req, res) => {
  try {
    const newUser = await User.updateOne(
      { _id: req.params.userId },
      { $set: { img: req.body.img } }
    );
    const newCookie = JSON.parse(req.session.user);
    newCookie.img = req.body.img;
    req.session.user = JSON.stringify(newCookie);
    res.json(newUser);
  } catch (err) {
    res.json({ message: err });
  }
});

//CART

router.post("/addcart/:userId", async (req, res) => {
  try {
    const prices = req.body.price * req.body.quantity;
    const userCart = await User.updateOne(
      { _id: req.params.userId },
      { $push: { cart: req.body }, $inc: { cart_total: prices } }
    );
    const newCookie = JSON.parse(req.session.user);
    newCookie.cart.push(req.body);
    newCookie.cart_total += prices;
    req.session.user = JSON.stringify(newCookie);
    res.json(userCart);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/removecart/:userId", async (req, res) => {
  try {
    const userCart = await User.updateOne(
      { _id: req.params.userId },
      {
        $pull: { cart: { _id: req.body._id, color: req.body.color } },
        $inc: { cart_total: -req.body.prices },
      }
    );
    const newCookie = JSON.parse(req.session.user);
    newCookie.cart = newCookie.cart.filter(
      (product) =>
        product._id !== req.body._id || product.color !== req.body.color
    );
    newCookie.cart_total -= req.body.prices;
    req.session.user = JSON.stringify(newCookie);
    res.json(userCart);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/clearcart/:userId", async (req, res) => {
  try {
    const userCart = await User.updateOne(
      { _id: req.params.userId },
      { $set: { cart: [], cart_total: 0 } }
    );
    const newCookie = JSON.parse(req.session.user);
    newCookie.cart = [];
    newCookie.cart_total = 0;
    req.session.user = JSON.stringify(newCookie);
    res.json(userCart);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/updatequantity/:userId", async (req, res) => {
  try {
    const userCart = await User.updateOne(
      {
        _id: req.params.userId,
        "cart._id": req.body._id,
        "cart.color": req.body.color,
      },
      {
        $inc: {
          "cart.$.quantity": req.body.quantity,
          cart_total: req.body.price,
        },
      }
    );
    const newCookie = JSON.parse(req.session.user);
    const index = await newCookie.cart.findIndex(
      (product) =>
        product._id === req.body._id && product.color === req.body.color
    );
    newCookie.cart[index].quantity += req.body.quantity;
    newCookie.cart_total += req.body.price;
    req.session.user = JSON.stringify(newCookie);
    res.json(userCart);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
