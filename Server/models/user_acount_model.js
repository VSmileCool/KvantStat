const {DataTypes} = require('sequelize')
const sequelize = require('../db');

const userAccount = sequelize.define("user_account", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        // autoIncrement: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    login: {
        type: DataTypes.STRING,
        allowNull: false
    },


}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = userAccount