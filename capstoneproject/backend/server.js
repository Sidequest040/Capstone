const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const OpenAI = require('openai');
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

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Exponential backoff function
const exponentialBackoff = (retries) => {
    const delay = Math.pow(2, retries) * 100 + Math.random() * 100;
    return new Promise(resolve => setTimeout(resolve, delay));
};

// Root route handler
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Test Connection with Exponential Backoff
app.post('/test-connection', async (req, res) => {
    const { logData } = req.body;
    console.log('Received log data:', logData);

    let retries = 0;
    const maxRetries = 5;

    while (retries < maxRetries) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: logData }],
            });

            const analysis = response.choices[0].message.content;
            return res.status(200).send({ message: analysis });
        } catch (error) {
            if (error.code === 'insufficient_quota' || error.code === 'rate_limit_exceeded') {
                retries += 1;
                console.error(`Rate limit exceeded, retrying... Attempt ${retries}`);
                await exponentialBackoff(retries);
            } else {
                console.error('Error with OpenAI API:', error);
                return res.status(500).send({ message: 'Error analyzing log data with OpenAI' });
            }
        }
    }

    return res.status(429).send({ message: 'Exceeded maximum retries. Please try again later.' });
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

// Catch-all route handler for undefined routes
app.use((req, res, next) => {
    console.log('Request:', req.method, req.url);
    console.log('Response Headers:', res.getHeaders());
    next();
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
