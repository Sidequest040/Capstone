const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
    }
}, {
    tableName: 'users',
    freezeTableName: true,
    timestamps: false // Disable timestamps
});

module.exports = User;
