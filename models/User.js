// models/User.js or models/Query.js
const mongoose = require('mongoose');

const userQuerySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: ''
  },
  age: {
    type: String,
    trim: true,
    default: ''
  },
  gender: {
    type: String,
    enum: ['', 'male', 'female', 'other'],
    default: ''
  },
  crops: {
    type: String,
    trim: true,
    default: ''
  },
  familySize: {
    type: String,
    trim: true,
    default: ''
  },
  landSize: {
    type: String,
    trim: true,
    default: ''
  },
  query: {
    type: String,
    required: true,
    trim: true
  },
  schemes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme'
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserQuery', userQuerySchema);
