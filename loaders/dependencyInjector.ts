import { Container } from 'typedi';
import LoggerInstance from './logger';

export default ({ models, services }) => {
  try {
    models.forEach((m: { name: any; model: any }) => {
      Container.set(m.name, m.model);
    });

    // Inject Services
    services.forEach((s: { name: any; service: new () => void }) => {
      Container.set(s.name, new s.service());
    });

    Container.set('logger', LoggerInstance);
    LoggerInstance.info('✌️ Models injected into container');
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
