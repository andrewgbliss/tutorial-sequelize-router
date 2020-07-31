import { Sequelize } from 'sequelize';
import { CustomersFactory } from './Customers';
const config = require('../config/config');

const env = process.env.NODE_ENV;
const configEnv = config[env];

const sequelize = new Sequelize(process.env.DATABASE_URL, configEnv);

const models = {
  Customers: CustomersFactory(sequelize),
};

Object.values(models)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models));

const db = {
  ...models,
  sequelize,
  Sequelize,
};

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default db;
