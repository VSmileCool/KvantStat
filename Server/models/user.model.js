const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const user = sequelize.define("users", {
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  user_password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  institute_id: {
    foreignObject: { institute_id },
  },
 });

module.exports = user;
