const {DataTypes} = require('sequelize')
const sequelize = require('../db');

const region = sequelize.define("regions", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    federal_district: {
        type: DataTypes.STRING,
        allowNull: false
    }
    

}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = region