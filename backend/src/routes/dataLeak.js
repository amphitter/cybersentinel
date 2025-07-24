// backend/src/routes/dataLeak.js
const express = require('express');
const router = express.Router();

// POST /api/data-leak/check
router.post('/check', async (req, res) => {
  // TODO: Integrate HaveIBeenPwned API
  res.json({ result: 'Data leak check placeholder' });
});

module.exports = router; 