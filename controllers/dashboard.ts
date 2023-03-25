import { Container } from 'typedi';
import SubTaskService from '../services/sub_task';
import ProjectService from '../services/project';
import ClientService from '../services/client';
import { secondsToHmsTime } from '../utils/secondsToHmsTime';
import { Op } from 'sequelize';

const getTopProjectAndItsActivity = async opArgs => {
  const logger: any = Container.get('logger');
  try {
    const { startDate, endDate, workspace_id, limit, offset } = opArgs;
    logger.debug('Calling getTopProject with opArgs: %o', opArgs);
    const projectServiceInstance = Container.get(ProjectService);
    const clientServiceInstance = Container.get(ClientService);
    const { project_id, total_billable_hours, total_time } = await getTopProjectIdAndTimeInfo({
      startDate,
      endDate,
      workspace_id,
    });
    if (!project_id) {
      throw new Error('Tracked project not available');
    }
    const {
      project: { name, client_id },
    } = await projectServiceInstance.getProjectById({ id: project_id });
    const client_name = await clientServiceInstance.getClientNameByClientID(client_id);
    const where = {
      where: {
        project_id,
        subtask_date: { [Op.between]: [startDate, endDate] },
      },
      limit,
      offset,
    };

    const project_activities = await getTopProjectActivities(where);
    const topProject = {
      project_name: name,
      total_billable_hours: secondsToHmsTime(total_billable_hours),
      total_time: secondsToHmsTime(total_time),
      client_name,
      project_activities,
    };
    return topProject;
  } catch (error) {
    logger.error('🔥 error while getting top project : %o', error);
    return error;
  }
};

const getTopProjectIdAndTimeInfo = async opArgs => {
  const logger: any = Container.get('logger');
  try {
    logger.debug('Calling getTopProjectTimeInfo with opArgs: %o', opArgs);
    const subTaskServiceInstance = Container.get(SubTaskService);
    const initialValue = { project_id: null, total_billable_hours: 0, total_time: 0 };
    const projectData = await subTaskServiceInstance.getProjectsTimeInfo(opArgs);
    const { project_id, total_billable_hours, total_time } = await projectData.reduce(
      (
        currentProject: { project_id: number; total_billable_hours: number; total_time: number },
        nextProject: { project_id: number; total_billable_hours: number; total_time: number }
      ) => {
        return currentProject.total_billable_hours >= nextProject.total_billable_hours ? currentProject : nextProject;
      },
      initialValue
    );
    return {
      project_id,
      total_billable_hours,
      total_time,
    };
  } catch (error) {
    logger.error('🔥 error while getting top project time information : %o', error);
    return error;
  }
};

const getTopProjectActivities = async opArgs => {
  const logger: any = Container.get('logger');
  try {
    logger.debug('Calling getTopProjectActivities with opArgs: %o', opArgs);
    const subTaskServiceInstance = Container.get(SubTaskService);
    const projectActivities = await subTaskServiceInstance.getProjectActivitiesByProjectId(opArgs);
    const topProjectActivities = JSON.parse(JSON.stringify(projectActivities));
    return topProjectActivities;
  } catch (error) {
    logger.error('🔥 error while getting top project activity: %o', error);
  }
};

export { getTopProjectAndItsActivity };
