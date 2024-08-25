const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('cybersecurity', 'root', 'your_new_password', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Set to `true` to see SQL queries in the console
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
