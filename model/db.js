import { Sequelize } from 'sequelize';
import config from '../config/config.js';
// todo : mettre en variable d'environnement + mettre une db local

const Database = new Sequelize(
  config.DATABASE,
  config.DATABASE_USERNAME,
  config.DATABASE_PASSWORD,
  {
    host: config.DATABASE_HOST,
    port: config.MYSQL_PORT,
    dialect: 'mysql',
  },
);

(async () => {
  try {
    await Database.authenticate();
    await Database.sync();
    console.log('Database is ready');
  } catch (error) {
    console.log('database is down');
  }
})();

export default Database;
