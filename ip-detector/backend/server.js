// backend/server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Load environment variables from .env file
require('dotenv').config();

const app = express();

// Enable CORS for your frontend URL
app.use(cors({
  origin: 'https://obscure-trout-jjrvqq45g96pf5q47-3000.app.github.dev' // Replace with your actual frontend URL
}));

const PORT = process.env.PORT || 5000;

// Log the API key to verify it's loaded (optional)
console.log('IPQualityScore API Key:', process.env.IPQUALITYSCORE_API_KEY);

app.get('/check-ip', async (req, res) => {
  // Get the IP address from the query parameter
  const ip = req.query.ip;

  if (!ip) {
    return res.status(400).json({ error: 'IP address is required' });
  }

  try {
    const API_KEY = process.env.IPQUALITYSCORE_API_KEY;
    if (!API_KEY) {
      throw new Error('IPQualityScore API key is not set.');
    }

    const response = await axios.get(
      `https://ipqualityscore.com/api/json/ip/${API_KEY}/${ip}`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error checking IP:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error checking IP' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
