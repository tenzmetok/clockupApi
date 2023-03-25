import { Container } from 'typedi';
import TaskService from '../services/task';
import { ITask } from '../types/Task';

const addTask = async (body): Promise<boolean> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addTask with body: %o', body);
  try {
    const taskServiceInstance = Container.get(TaskService);
    const isAdded = await taskServiceInstance.addTask(body);
    return isAdded;
  } catch (e) {
    logger.error('🔥 error while adding task: %o', e);
    return e;
  }
};

const getTask = async id => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getClient with param: %o', id);
  try {
    const taskServiceInstance = Container.get(TaskService);
    const { task } = await taskServiceInstance.getTask({ id });
    if (!task) {
      throw new Error('Record Not Found');
    }
    return task;
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};

const getFilteredTasks = async opArgs => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getFilterTask with param: %o', opArgs);
  try {
    const taskServiceInstance = Container.get(TaskService);
    const { task, count } = await taskServiceInstance.getFilteredTasks(opArgs);
    return { task, count };
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};

const removeTask = async (id): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling removeTask with param: %o', id);
  try {
    const taskServiceInstance = Container.get(TaskService);
    const isRemoved = await taskServiceInstance.removeTask(id);
    return isRemoved;
  } catch (e) {
    console.error('🔥 error while removing tag: %o', e);
    return e;
  }
};

const updateTask = async (body: ITask): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug(`Calling updateTask with body %o`, body);
  try {
    const taskServiceInstance = Container.get(TaskService);
    const isUpdated = await taskServiceInstance.updateTask(body);
    return isUpdated;
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};

export { addTask, getTask, getFilteredTasks, removeTask, updateTask };
