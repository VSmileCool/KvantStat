const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  patronymic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  certificate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  yearOfGraduation: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rights: {
    type: DataTypes.STRING,
    allowNull: false,
    default: "user",
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  confirmation: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});
module.exports = User;
