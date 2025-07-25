// backend/src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const chatRoutes = require('./routes/chat');
const malwareRoutes = require('./routes/malware');
const awarenessRoutes = require('./routes/awareness');
const threatRoutes = require('./routes/threat');
const sandboxRoutes = require('./routes/sandbox');
const dataLeakRoutes = require('./routes/dataLeak');
const phishingRoutes = require('./routes/phishing');
const analyticsRoutes = require('./routes/analytics');
const extensionRoutes = require('./routes/extension');
const authRoutes = require('./routes/auth');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/malware', malwareRoutes);
app.use('/api/awareness', awarenessRoutes);
app.use('/api/threat', threatRoutes);
app.use('/api/sandbox', sandboxRoutes);
app.use('/api/data-leak', dataLeakRoutes);
app.use('/api/phishing', phishingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/extension', extensionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 