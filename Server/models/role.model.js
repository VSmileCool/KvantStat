const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Role = sequelize.define("roles", {
  value: {
    type: DataTypes.STRING,
    unique: true,
    default: "USER",
    primaryKey: true,
  },
});

module.exports = Role;
