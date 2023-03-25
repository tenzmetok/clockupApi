import { Container } from 'typedi';
import TimeTrackerService from '../services/TimeTracker';

const addSubTask = async body => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addSubTask with param: %o', body);
  try {
    const timeTrackerServiceInstance = Container.get(TimeTrackerService);
    const { subTaskData } = await timeTrackerServiceInstance.addSubTask(body);
    return subTaskData;
  } catch (e) {
    logger.error('🔥 error occured while adding subtask: %o', e);
    return e;
  }
};

const addSubTaskTags = async body => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addSubTaskTags with param: %o', body);
  try {
    const timeTrackerServiceInstance = Container.get(TimeTrackerService);
    const { subTaskTagData } = await timeTrackerServiceInstance.addSubTaskTags(body);
    return subTaskTagData;
  } catch (e) {
    logger.error('🔥 error occured while adding subtask tags: %o', e);
    return e;
  }
};
const updateSubTask = async body => {
  const logger: any = Container.get('logger');
  logger.debug(`Calling updateSubTask and param %o`, body);
  try {
    const timeTrackerServiceInstance = Container.get(TimeTrackerService);
    const isUpdated = await timeTrackerServiceInstance.updateSubTask(body);
    return isUpdated;
  } catch (e) {
    logger.error('🔥 error occured while updating subtask: %o', e);
    return e;
  }
};
const updateSubTaskList = async (body, subTaskId) => {
  const logger: any = Container.get('logger');
  logger.debug(`Calling updateSubTaskList and param %o`, body);
  try {
    const timeTrackerServiceInstance = Container.get(TimeTrackerService);
    const isUpdated = await timeTrackerServiceInstance.updateSubTaskList(body, subTaskId);
    return isUpdated;
  } catch (e) {
    logger.error('🔥 error occured while updating subtask list: %o', e);
    return e;
  }
};

const updateSubTaskTagsOfList = async (subTaskTags, subTaskId) => {
  const logger: any = Container.get('logger');
  logger.debug(`Calling updateSubTaskTagsOfList with param %o`, subTaskTags);
  try {
    const timeTrackerServiceInstance = Container.get(TimeTrackerService);
    const { updatedSubTaskTagsData } = await timeTrackerServiceInstance.updateSubTaskTagsOfList(subTaskTags, subTaskId);
    return updatedSubTaskTagsData;
  } catch (e) {
    logger.error('🔥 error occured while updating subtasks tags of list: %o', e);
    return e;
  }
};

const removeSubTask = async (body): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling removeSubTask with param: %o', body);
  try {
    const timeTrackerServiceInstance = Container.get(TimeTrackerService);
    const isRemoved = await timeTrackerServiceInstance.removeSubTask(body);
    return isRemoved;
  } catch (e) {
    logger.error('🔥 error occured while removing subtasks: %o', e);
    return e;
  }
};
const removeSubTaskTags = async (body): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling removeSubTaskTags with param: %o', body);
  try {
    const timeTrackerServiceInstance = Container.get(TimeTrackerService);
    const isRemoved = await timeTrackerServiceInstance.removeSubTaskTags(body);
    return isRemoved;
  } catch (e) {
    logger.error('🔥 error occured while removing subtasks tags: %o', e);
    return e;
  }
};
const getTimeTrackerTasks = async opArgs => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getTimeTrackerTasks with param: %o', opArgs);
  try {
    const timeTrackerServiceInstance = Container.get(TimeTrackerService);
    const { timeTrackerTasks, count } = await timeTrackerServiceInstance.getTimeTrackerTasks(opArgs);

    return { timeTrackerTasks, count };
  } catch (e) {
    logger.error('🔥 error occured while getting timetracker tasks : %o', e);
    return e;
  }
};
const getSubTasks = async opArgs => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getSubTasks with param: %o', opArgs);
  try {
    const timeTrackerServiceInstance = Container.get(TimeTrackerService);
    const { subTasksData, count } = await timeTrackerServiceInstance.getSubTasks(opArgs);
    return { subTasksData, count };
  } catch (e) {
    logger.error('🔥 error occured while getting subtasks: %o', e);
    return e;
  }
};
const getRunningSubTask = async body => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getRunningSubTask with param: %o', body);
  try {
    const timeTrackerServiceInstance = Container.get(TimeTrackerService);
    const { runningSubTask } = await timeTrackerServiceInstance.getRunningSubTask(body);
    return { runningSubTask };
  } catch (e) {
    logger.error('🔥 error occured while getting running subtask: %o', e);
    return e;
  }
};
export {
  addSubTask,
  addSubTaskTags,
  updateSubTaskList,
  updateSubTaskTagsOfList,
  getSubTasks,
  getTimeTrackerTasks,
  removeSubTask,
  updateSubTask,
  getRunningSubTask,
  removeSubTaskTags,
};
