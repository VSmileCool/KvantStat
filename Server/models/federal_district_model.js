const {DataTypes} = require('sequelize')
const sequelize = require('../db');

const federalDistrict = sequelize.define("federal_disctrict", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    

}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = federalDistrict