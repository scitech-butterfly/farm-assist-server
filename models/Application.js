const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  status: { type: String, default: 'submitted' }, // submitted/processing/approved/rejected
  appliedAt: { type: Date, default: Date.now },
  meta: Object // optional extra data
});

module.exports = mongoose.model('Application', ApplicationSchema);
