const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  age: Number,
  gender: String,
  crops: String, // comma-separated or array if you prefer
  applied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
