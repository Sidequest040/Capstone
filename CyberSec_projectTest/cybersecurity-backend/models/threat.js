const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Threat = sequelize.define('Threat', {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'threats', // Explicitly define the table name
    freezeTableName: true, // Prevent Sequelize from pluralizing the table name
});

module.exports = Threat;
