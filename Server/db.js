import { Sequelize } from "sequelize";

const db = new Sequelize({
  database: "KvantStat",
  username: "postgres",
  password: "root",
  host: "localhost",
  dialect: "postgres",
  port: 5432,
});

export default db;
