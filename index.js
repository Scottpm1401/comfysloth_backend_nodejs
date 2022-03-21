const express = require("express");
const db = require("./connection");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const app = express();
require("dotenv").config();

app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    method: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "X-Requested-With",
      "X-HTTP-Method-Override",
      "Accept",
    ],
  })
);

app.set("trust proxy", 1);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    path: `${process.env.FRONT_END_URL}/`,
    key: "user",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 1000 * 60 * 60 * 24 * 7,
      httpOnly: false,
      sameSite: "None",
      secure: true,
    },
  })
);

const productsRoute = require("./routes/products");
const featuredRoute = require("./routes/featured");
const usersRoute = require("./routes/users");
const paymentRoute = require("./routes/payment");
app.use("/products", productsRoute);
app.use("/featured", featuredRoute);
app.use("/users", usersRoute);
app.use("/payment", paymentRoute);

db();

app.listen(process.env.PORT || 3001, () => {
  console.log("server started");
});
