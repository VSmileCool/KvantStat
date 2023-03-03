const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const user_model = require("../models/user.model");

const token = sequelize.define("tokens", {
  refreshToken: {
    primaryKey: true,
    type: DataTypes.STRING,
    allowNull: false,
  },
});

user_model.hasOne(token);

module.exports = token;
