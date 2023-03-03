const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const institutes = sequelize.define("institutes", {
  institute_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  institute_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = institutes;
