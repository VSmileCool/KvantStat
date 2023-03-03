const {DataTypes} = require('sequelize')
const sequelize = require('../db');

const universityInRegionModel = sequelize.define("university_in_region_model", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },

    university: {
        type: DataTypes.STRING,
        allowNull: false
    },

    region: {
        type: DataTypes.STRING,
        allowNull: false
    }
    

}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = universityInRegionModel