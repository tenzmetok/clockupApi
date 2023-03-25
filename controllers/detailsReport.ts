import { Container } from 'typedi';
import { DetailsReportService } from '../services/detailsReport';
import ProjectService from '../services/project';
import { Op } from 'sequelize';

const getDetailsReport = async opArgs => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getDetailsReport with param: %o', opArgs);
  try {
    const {
      limit,
      offset,
      where: { workspace_id, client_id, visiblity_status, startDate, endDate },
    } = opArgs;

    let {
      where: { project_id },
    } = opArgs;

    let whereClause = {};
    const detailsReportServiceInstance = Container.get(DetailsReportService);

    if (!project_id && !visiblity_status && !client_id) {
      let whereSubtask = {};
      whereSubtask = { ...whereSubtask, workspace_id, project_id: { [Op.not]: null } };
      if (startDate) {
        whereSubtask = { ...whereSubtask, subtask_date: { [Op.between]: [startDate, endDate] } };
      }
      const projectArgs = {
        limit: 1,
        where: whereSubtask,
        order: [['updated_at', 'DESC']],
      };

      const subTasks = await detailsReportServiceInstance.getLatestProjectDetails(projectArgs);
      project_id = subTasks[0].project_id;
    }

    if (visiblity_status || project_id || client_id || startDate) {
      let whereProjectClause = {};
      whereProjectClause = { ...whereProjectClause, workspace_id };
      if (visiblity_status) {
        whereProjectClause = { ...whereProjectClause, visiblity_status };
      }
      if (project_id) {
        whereProjectClause = { ...whereProjectClause, id: project_id };
      }
      if (client_id) {
        whereProjectClause = { ...whereProjectClause, client_id };
        whereClause = { ...whereClause, client_id };
      }
      const projectArgs = {
        where: whereProjectClause,
      };
      const projectServiceInstance = Container.get(ProjectService);
      const { projects } = await projectServiceInstance.getFilteredProjects(projectArgs);
      if (!projects) {
        throw new Error('Record Not Found');
      }
      const projectIdArray = projects?.map(val => {
        return val.id;
      });

      if (projectIdArray.length > 1) {
        let whereProjectClause = {};
        whereProjectClause = { ...whereProjectClause, workspace_id, project_id: { [Op.in]: projectIdArray } };
        if (startDate) {
          whereProjectClause = { ...whereProjectClause, subtask_date: { [Op.between]: [startDate, endDate] } };
        }
        const projectArgs = {
          limit: 1,
          where: whereProjectClause,
          order: [['updated_at', 'DESC']],
        };
        const subTasks = await detailsReportServiceInstance.getLatestProjectDetails(projectArgs);
        project_id = subTasks[0].project_id;
      } else if (projectIdArray.length === 1) {
        project_id = projectIdArray[0];
      } else {
        throw new Error('Record Not Found');
      }
    }

    if (startDate) {
      whereClause = { ...whereClause, subtask_date: { [Op.between]: [startDate, endDate] } };
    }
    if (project_id) whereClause = { ...whereClause, project_id, workspace_id };
    else throw new Error('Record not Found');
    const projArgs = {
      limit,
      offset,
      where: whereClause,
      order: [['updated_at', 'DESC']],
    };

    const { subtaskData, count } = await detailsReportServiceInstance.getsubTask(projArgs);
    if (!subtaskData) {
      throw new Error('Record Not Found');
    }
    subtaskData.map(val => {
      if (val.is_billable) {
        let total_money = 0;
        const splitTime = `${val.total_time}  `.split(':');
        const totals = splitTime[1];
        const chunk = `${splitTime[0]}.${parseInt(totals, 10)}`;
        total_money = chunk * val.project.bill_rate;
        val.amount = total_money;
      } else {
        val.amount = 0;
      }
    });
    return { subtaskData, count };
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};

export { getDetailsReport };
