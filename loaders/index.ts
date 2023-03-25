import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import Logger from './logger';
import sequelize from './sequelize';
import db from '../models';

export default async (expressApp = null) => {
  const models: any = [];
  const services = [];

  // Load & Verify sequelize connection
  await sequelize.authenticate();
  Logger.info('✌️ Database loaded');

  // Load dependencies
  for (const [key, value] of Object.entries(db)) {
    models.push({
      name: `${key}Model`,
      model: value,
    });
  }
  dependencyInjectorLoader({
    models,
    services,
  });
  Logger.info('✌️ Dependency Injector loaded');

  // Load express app
  if (expressApp) {
    await expressLoader({ app: expressApp });
    Logger.info('✌️ Express loaded');
  }
  return { sequelize };
};
