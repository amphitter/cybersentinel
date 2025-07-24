# CyberSentinel Backend

Node.js backend for the CyberSentinel chatbot and security platform.

## Features
- Chatbot (Groq API)
- Malware & Phishing Detection (VirusTotal)
- Data Leak Checker (HaveIBeenPwned)
- Threat Analytics & Crowdsourced Learning
- Awareness Training & Virtual Sandbox

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set API keys and PostgreSQL URI in `.env`:
   - GROQ_API_KEY
   - VIRUSTOTAL_API_KEY
   - POSTGRES_URI (e.g. postgresql://postgres:password@localhost:5432/cybersentinel)
3. Start the server:
   ```bash
   npm start
   ```

## Directory Structure
```
src/
  index.js           # Entry point
  routes/            # All route definitions
  services/          # Logic for each feature
  models/            # Data models (if needed)
  config/            # API keys, settings
  db.js              # DB connection
``` 