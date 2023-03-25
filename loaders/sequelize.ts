import config from '../config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(config.db);

export default sequelize;
