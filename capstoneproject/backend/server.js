const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();  // Load environment variables from .env file

const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL,  // Use FRONTEND_URL from .env
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Increase the payload size limit to handle larger requests, such as images
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'db',  // Use DB_HOST from .env or fallback to 'db'
    user: process.env.DB_USER,          // Use DB_USER from .env
    password: process.env.DB_PASSWORD,  // Use DB_PASSWORD from .env
    database: process.env.DB_NAME       // Use DB_NAME from .env
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Root route handler
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Exponential backoff function
const exponentialBackoff = (retries) => {
    const delay = Math.pow(2, retries) * 100 + Math.random() * 100;
    return new Promise(resolve => setTimeout(resolve, delay));
};

// RapidAPI Network Scan Route
app.get('/network-scan', async (req, res) => {
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
app.post('/test-connection', async (req, res) => {
    const { logData } = req.body;
    console.log('Received log data:', logData);

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

    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
        try {
            const response = await axios.request(options);
            const analysis = response.data.result;
            console.log('Received response from RapidAPI:', response.data);
            return res.status(200).send({ message: analysis });
        } catch (error) {
            if (error.code === 'ERR_BAD_RESPONSE' || error.response?.status === 504) {
                retries += 1;
                console.error(`Attempt ${retries} failed:`, error.message);
                await exponentialBackoff(retries);
            } else {
                console.error('Error with RapidAPI ChatGPT:', error);
                return res.status(500).send({ message: 'Error analyzing log data with RapidAPI ChatGPT' });
            }
        }
    }

    return res.status(500).send({ message: 'Failed to process request after multiple attempts. Please try again later.' });
});

// Register User
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
    [username, email, hashedPassword], 
    (err, result) => {
        if (err) {
            res.status(500).send('Server error');
        } else {
            res.status(200).send({ message: 'User registered successfully!' });
        }
    });
});

// Login User
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) throw err;
        if (result.length && bcrypt.compareSync(password, result[0].password)) {
            const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });  // Use JWT_SECRET from .env
            res.status(200).send({ message: 'Login successful', token });
        } else {
            res.status(401).send({ message: 'Invalid credentials' });
        }
    });
});

// Fetch user profile by email
app.get('/profile/:email', (req, res) => {
    const email = req.params.email;
    db.query('SELECT * FROM user_profiles WHERE email = ?', [email], (err, result) => {
        if (err) return res.status(500).send('Server error');
        if (result.length) {
            res.status(200).send(result[0]);
        } else {
            res.status(404).send('Profile not found');
        }
    });
});

// Update user profile
app.post('/profile/update', (req, res) => {
    const { email, name, status, bio, profilePicture } = req.body;
    db.query('UPDATE user_profiles SET name = ?, status = ?, bio = ?, profile_picture = ? WHERE email = ?', 
        [name, status, bio, profilePicture, email], 
        (err, result) => {
            if (err) return res.status(500).send('Server error');
            res.status(200).send({ message: 'Profile updated successfully' });
        }
    );
});

// Catch-all route handler for undefined routes
app.use((req, res, next) => {
    console.log('Request:', req.method, req.url);
    console.log('Response Headers:', res.getHeaders());
    next();
});

// Start server on the port from .env
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
