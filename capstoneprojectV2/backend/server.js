// server.js

// Import required modules
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001; // Use the PORT from .env

// Middleware
app.use(cors());
app.use(express.json());

// Database connection using Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,       // Database name
  process.env.DB_USER,       // Database username
  process.env.DB_PASSWORD,   // Database password
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

// Test the database connection
sequelize
  .authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log('Error: ' + err));

// Define User model
const User = sequelize.define('User', {
  // Model attributes
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {                          
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,                
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sync the model with the database
sequelize.sync().then(() => {
  console.log('Database synced');
});

// **Root route to handle GET requests to '/'**
app.get('/', (req, res) => {
  res.send('Backend server is running on port 3001!');
});

// Register route
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please enter all fields' });
  }

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ where: { username } });
    const existingEmail = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter all fields' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected route example
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({ user: req.user }); // No message sent
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Add user info to request object
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
}

// API integration with RapidAPI
app.get('/api/network-scan', async (req, res) => {
  try {
    // Make a GET request to the RapidAPI network scan endpoint using the key from .env
    const response = await axios.get('https://netdetective.p.rapidapi.com/query', {
      headers: {
        'x-rapidapi-host': 'netdetective.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY_1  // Use RAPIDAPI_KEY_1 from .env
      }
    });

    // Return the network scan results to the client
    res.status(200).send(response.data);
  } catch (error) {
    console.error('Error scanning the network:', error.message);
    res.status(500).send({ message: 'Network scan failed' });
  }
});

// Test Connection with RapidAPI ChatGPT API
app.post('/api/test-connection', async (req, res) => {
  const { logData } = req.body;

  const options = {
    method: 'POST',
    url: 'https://chatgpt-42.p.rapidapi.com/gpt4',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY_2,  // Use RAPIDAPI_KEY_2 from .env
      'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      messages: [
        {
          role: 'user',
          content: logData
        }
      ],
      web_access: false
    }
  };

  try {
    const response = await axios.request(options);
    const analysis = response.data.result;
    res.status(200).send({ message: analysis });
  } catch (error) {
    console.error('Error with RapidAPI ChatGPT:', error);
    res.status(500).send({ message: 'Error analyzing log data with RapidAPI ChatGPT' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
