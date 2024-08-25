const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Threat = sequelize.define('Threat', {
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Threat;
