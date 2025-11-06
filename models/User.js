const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  age: String,
  gender: { type: String, enum: ["male", "female", "other"] },
  crops: String,
  familySize: String,
  landSize: String,

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
