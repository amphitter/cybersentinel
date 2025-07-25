// backend/src/routes/phishing.js
const express = require('express');
const { scanUrlWithVirusTotal } = require('../services/virustotal');
const mongoose = require('mongoose');
const ScanHistory = require('../models/ScanHistory');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken'); // You need to create this middleware

const router = express.Router();

// POST /api/phishing/scan (with token-based auth)
router.post('/scan', verifyToken, async (req, res) => {
  const { url } = req.body;
  const userId = req.userId;

  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    const result = await scanUrlWithVirusTotal(url);

    // Save scan to ScanHistory collection (optional)
    await ScanHistory.create({ type: 'phishing', input: url, result });

    // Update user's link history and visit stats
    const now = new Date();

    await User.findByIdAndUpdate(userId, {
      $push: {
        linkHistory: {
          url,
          status: getStatus(result),
          time: now.toISOString(),
        },
      },
      $inc: {
        'linkVisits.today': 1,
        'linkVisits.thisWeek': 1,
        'linkVisits.thisMonth': 1,
      },
    });

    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Phishing scan failed', details: err.message });
  }
});

function getStatus(result) {
  try {
    const parsed = typeof result === 'string' ? JSON.parse(result) : result;
    const engines = Object.values(parsed || {});
    const flagged = engines.filter(
      (e) =>
        e && e.result &&
        !['clean', 'harmless', 'undetected', 'unrated', 'safe'].includes((e.result || '').toLowerCase())
    ).length;
    return flagged > 0 ? 'Suspicious' : 'Safe';
  } catch {
    return 'Unknown';
  }
}

module.exports = router;
