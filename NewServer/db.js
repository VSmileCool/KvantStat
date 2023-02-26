import { Sequelize } from 'sequelize';

const db = new Sequelize({
  database: 'KvantStats',
  username: 'postgres',
  password: 'root',
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
});

export default db;
