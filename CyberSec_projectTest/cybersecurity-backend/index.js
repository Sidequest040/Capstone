const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./models/sequelize');
const Threat = require('./models/threat');
const User = require('./models/user');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sync models with database
sequelize.sync();

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Cybersecurity API');
});

// Threat Routes
app.get('/api/threats', async (req, res) => {
    try {
        const threats = await Threat.findAll();
        res.json(threats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/threats', async (req, res) => {
    try {
        const { type, description, status } = req.body;
        const newThreat = await Threat.create({ type, description, status });
        res.json(newThreat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// User Routes
// Create a new user
app.post('/api/users', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        // Optional: Add hashing of password before storing it
        const newUser = await User.create({ username, password, role });
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single user by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a user
app.put('/api/users/:id', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const user = await User.findByPk(req.params.id);
        if (user) {
            user.username = username;
            user.password = password; // Optional: Hash the password before saving
            user.role = role;
            await user.save();
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
