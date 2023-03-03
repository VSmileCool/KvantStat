const {DataTypes} = require('sequelize')
const sequelize = require('../db');

const userInUniversity = sequelize.define("user_in_university", {
    certificate_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },

    user_id: {
        type: DataTypes.STRING,
        allowNull: false
    },

    university_id: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = userInUniversity