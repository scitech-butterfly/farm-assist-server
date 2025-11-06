const mongoose = require("mongoose");

const userQuerySchema = new mongoose.Schema(
  {
    name: String,
    age: String,
    gender: String,
    crops: String,
    familySize: String,
    landSize: String,
    query: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserQuery", userQuerySchema);
