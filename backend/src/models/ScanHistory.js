// backend/src/models/ScanHistory.js
const mongoose = require('mongoose');

const ScanHistorySchema = new mongoose.Schema({
  type: { type: String, required: true },
  input: { type: String, required: true },
  result: { type: mongoose.Schema.Types.Mixed, required: true },
  scannedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ScanHistory', ScanHistorySchema); 