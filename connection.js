const mongoose = require("mongoose");
require("dotenv").config();

const db = async () => {
  await mongoose.connect(process.env.DB_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("db connected");
};

module.exports = db;
