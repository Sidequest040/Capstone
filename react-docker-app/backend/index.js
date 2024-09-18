const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

// CORS configuration to allow requests from specific frontend URLs
const allowedOrigins = [
  'https://curly-space-umbrella-wrvpgg974x9j25x4r-3000.app.github.dev',
  'http://localhost:3000'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Make sure this is enabled to allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


app.use(express.json());  // For parsing application/json

// Root route to avoid "Cannot GET /" error
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Add a healthcheck route for testing backend availability
app.get('/auth/healthcheck', (req, res) => {
  res.json({ message: 'Backend is healthy' });
});

// Define routes
app.use('/auth', authRoutes);

// Set server port and listen
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
