const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const certificate_ids = sequelize.define(
  "certificate_ids",
  {
    certificate_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
  },
  { timestamp: false }
);

module.exports = certificate_ids;
