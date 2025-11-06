const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },   // Scheme Name
  link: { type: String },                   // Official link / portal
  eligibility: { type: String },            // Who can apply
  benefits: { type: String },               // Key benefits
  description: { type: String },            // Overview
  faqs: { type: String }                  // FAQ text (optional: can later be array)                       // Useful for searching
}, { timestamps: true });

// 🔍 Full-text search index
SchemeSchema.index({
  name: "text",
  description: "text",
  eligibility: "text",
  benefits: "text",
  faqs: "text"
});

module.exports = mongoose.model('Scheme', SchemeSchema);
