import { Container } from 'typedi';
import ClientService from '../services/client';
import { IClientInput } from '../types/Client';

const addClient = async (body): Promise<boolean> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addClient with body: %o', body);
  try {
    const clientServiceInstance = Container.get(ClientService);
    const isAdded = await clientServiceInstance.addClient(body);
    return isAdded;
  } catch (e) {
    logger.error('🔥 error occured while adding client: %o', e);
    return e;
  }
};

const getClientsByWorkspaceId = async workspace_id => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getClientsByWorkspaceId with param: %o', workspace_id);
  try {
    const clientServiceInstance = Container.get(ClientService);
    const { clients } = await clientServiceInstance.getClientsByWorkspaceId({
      workspace_id,
    });
    if (!clients) {
      throw new Error('Record Not Found');
    }
    return clients;
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};

const updateClient = async (body: IClientInput): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug(`Calling updateClient and body %o`, body);
  try {
    const clientServiceInstance = Container.get(ClientService);
    const isUpdated = await clientServiceInstance.updateClient(body);
    return isUpdated;
  } catch (e) {
    logger.error('🔥 error while updating client: %o', e);
    return e;
  }
};

const removeClient = async (id): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling removeClient with param: %o', id);
  try {
    const clientServiceInstance = Container.get(ClientService);
    const isRemoved = await clientServiceInstance.removeClient(id);
    return isRemoved;
  } catch (e) {
    logger.error('🔥 error while removing client: %o', e);
    return e;
  }
};

const getFilteredClients = async opArgs => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getClients');
  try {
    const clientServiceInstance = Container.get(ClientService);
    const { clients, count } = await clientServiceInstance.getFilteredClients(opArgs);
    return { clients, count };
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};
export { addClient, getClientsByWorkspaceId, updateClient, removeClient, getFilteredClients };
