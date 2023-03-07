const {DataTypes} = require('sequelize')
const sequelize = require('../db');

const user = sequelize.define("users", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
        
    },

    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    father_name: {
        type: DataTypes.STRING,
        allowNull: true
    },

    email: {
        type: DataTypes.STRING,
        allowNull: true
    },

    date_of_birthday: {
        type: DataTypes.STRING,
        allowNull: false
    },

    certificate: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = user