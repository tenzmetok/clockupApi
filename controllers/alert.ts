import { Container } from 'typedi';
import AlertService from '../services/alert';
import { IAlert } from '../types/Alert';

const addAlert = async (body): Promise<boolean> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addAlert with body: %o', body);
  try {
    const alertServiceInstance = Container.get(AlertService);
    const isAlertAdded = await alertServiceInstance.addAlert(body);
    if (isAlertAdded) {
      await alertServiceInstance.sendAlertMail(body);
    }
    return isAlertAdded;
  } catch (e) {
    logger.error('🔥 error while adding alert: %o', e);
    return e;
  }
};

const getAllAlerts = async (opArgs): Promise<{ getAllAlerts: IAlert[]; count: number }> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling alerts with param: %o', opArgs);
  try {
    const alertServiceInstance = Container.get(AlertService);
    const { getAllAlerts, count } = await alertServiceInstance.getAllAlerts(opArgs);

    if (!getAllAlerts) {
      throw new Error('Record Not Found');
    }
    return { getAllAlerts, count };
  } catch (e) {
    logger.error('🔥 error while geting all alerts: %o', e);
    return e;
  }
};

const getAlert = async (id): Promise<{ alert: IAlert }> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getAlert with param: %o', id);
  try {
    const alertServiceInstance = Container.get(AlertService);
    const { alert } = await alertServiceInstance.getAlert({ id });
    if (!alert) {
      throw new Error('Record Not Found');
    }
    return { alert };
  } catch (e) {
    logger.error('🔥 error while getting alert by id: %o', e);
    return e;
  }
};

const updateAlert = async (body): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug(`Calling updateAlert with id ${body.id}: and body %o`, body);
  try {
    const alertServiceInstance = Container.get(AlertService);
    const isUpdated = await alertServiceInstance.updateAlert(body);
    if (isUpdated) {
      await alertServiceInstance.sendAlertMail(body);
    }
    return isUpdated;
  } catch (e) {
    logger.error('🔥 error while updating alert: %o', e);
    return e;
  }
};

const removeAlert = async (id): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling removeAlert with param: %o', id);
  try {
    const alertServiceInstance = Container.get(AlertService);
    const isRemoved = await alertServiceInstance.removeAlert(id);
    return isRemoved;
  } catch (e) {
    console.error('🔥 error while removing alert: %o', e);
    return e;
  }
};

export { addAlert, getAllAlerts, getAlert, updateAlert, removeAlert };
