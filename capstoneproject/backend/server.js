const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_new_password',
    database: 'user_dashboard'
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

// Test Connection with RapidAPI ChatGPT API
app.post('/test-connection', async (req, res) => {
    const { logData } = req.body;
    console.log('Received log data:', logData);

    const options = {
        method: 'POST',
        url: 'https://chatgpt-42.p.rapidapi.com/gpt4',
        headers: {
            'x-rapidapi-key': '3174ee127cmsh86affbe38530963p157252jsncbd64bd9917e',
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
            const token = jwt.sign({ id: result[0].id }, 'your_jwt_secret', { expiresIn: '1h' });
            res.status(200).send({ message: 'Login successful', token });
        } else {
            res.status(401).send({ message: 'Invalid credentials' });
        }
    });
});

// Fetch user profile by userId
app.get('/profile/:userId', (req, res) => {
    const userId = req.params.userId;
    db.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId], (err, result) => {
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
    const { userId, name, email, status, bio } = req.body;
    db.query('UPDATE user_profiles SET name = ?, email = ?, status = ?, bio = ? WHERE user_id = ?', 
        [name, email, status, bio, userId], 
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

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
