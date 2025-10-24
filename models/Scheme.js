const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  code: { type: String, unique: true }, // e.g. 'pm-kisan'
  title: { en: String, hi: String },
  description: { en: String, hi: String },
  keywords: [String],
  eligibility: String,
}, { timestamps: true });

// create text index for simple search
SchemeSchema.index({
  "title.en": "text",
  "title.hi": "text",
  "description.en": "text",
  "description.hi": "text",
  keywords: "text"
});

module.exports = mongoose.model('Scheme', SchemeSchema);
