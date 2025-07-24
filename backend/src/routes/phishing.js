// backend/src/routes/phishing.js
const express = require('express');
const { scanUrlWithVirusTotal } = require('../services/virustotal');
const mongoose = require('mongoose');
const ScanHistory = require('../models/ScanHistory');

const router = express.Router();

// POST /api/phishing/scan
router.post('/scan', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }
  try {
    const result = await scanUrlWithVirusTotal(url);
    // Save scan to MongoDB
    ScanHistory.create({ type: 'phishing', input: url, result }).catch(() => {});
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Phishing scan failed', details: err.message });
  }
});

// GET /api/phishing/history
router.get('/history', async (req, res) => {
  try {
    const scans = await ScanHistory.find({ type: 'phishing' })
      .sort({ scannedAt: -1 })
      .limit(10)
      .lean();
    res.json(scans);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch scan history' });
  }
});

module.exports = router; 