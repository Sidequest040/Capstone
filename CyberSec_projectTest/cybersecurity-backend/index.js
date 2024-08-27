const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./models/sequelize');
const Threat = require('./models/threat');
const User = require('./models/user');

const app = express();

// Enable CORS with more detailed configuration
app.use(cors({
    origin: '*', // Replace '*' with your frontend's URL for security
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

// Sync models with database
sequelize.sync({ alter: true }) // This will alter the tables to match the models
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Failed to sync database:', err));

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Cybersecurity API');
});

// Threat Routes
app.get('/api/threats', async (req, res) => {
    try {
        console.log("Received a GET request for threats"); // Debugging log
        const threats = await Threat.findAll();
        res.json(threats);
    } catch (error) {
        console.error("Error fetching threats:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/threats', async (req, res) => {
    try {
        console.log("Received a POST request to add a threat"); // Debugging log
        const { type, description, status } = req.body;
        const newThreat = await Threat.create({ type, description, status });
        res.json(newThreat);
    } catch (error) {
        console.error("Error adding threat:", error);
        res.status(400).json({ error: error.message });
    }
});

// User Routes
// Create a new user
app.post('/api/users', async (req, res) => {
    try {
        console.log("Received a POST request to create a new user"); // Debugging log
        const { username, password, role } = req.body;
        // Optional: Add hashing of password before storing it
        const newUser = await User.create({ username, password, role });
        res.json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(400).json({ error: error.message });
    }
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        console.log("Received a GET request for users"); // Debugging log
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get a single user by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        console.log(`Received a GET request for user with ID ${req.params.id}`); // Debugging log
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: error.message });
    }
});

// Update a user
app.put('/api/users/:id', async (req, res) => {
    try {
        console.log(`Received a PUT request to update user with ID ${req.params.id}`); // Debugging log
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
        console.error("Error updating user:", error);
        res.status(400).json({ error: error.message });
    }
});

// Delete a user
app.delete('/api/users/:id', async (req, res) => {
    try {
        console.log(`Received a DELETE request to remove user with ID ${req.params.id}`); // Debugging log
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
