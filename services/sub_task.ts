import { Service, Inject } from 'typedi';
import SubTask from '../models/sub_task';
import Tag from '../models/tag';
import Task from '../models/task';
import User from '../models/user';
@Service()
export default class SubTaskService {
  constructor(@Inject('SubTaskModel') private subTaskModel: typeof SubTask, @Inject('logger') private logger) {}
  public async removeSubTaskByTaskId(where = []): Promise<number> {
    try {
      const task_idArray = where.map(item => item.id);
      const isRemoved = await this.subTaskModel.destroy({
        where: {
          task_id: task_idArray,
        },
      });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getProjectsTimeInfo(where: { startDate: string; endDate: string; workspace_id: number }) {
    try {
      const { startDate, endDate, workspace_id } = where;
      const duration = startDate && endDate ? `AND subtask_date between '${startDate}' and '${endDate}'` : '';
      const [data] = await this.subTaskModel.sequelize.query(
        `with q1 as (select project_id, sum(total_time) as "total_billable_hours" from sub_tasks where project_id  IS NOT NULL AND is_billable = true AND workspace_id = '${workspace_id}' ${duration} group by project_id),
            q2 as (select project_id, sum(total_time) as "total_time" from sub_tasks where project_id  IS NOT NULL AND workspace_id = '${workspace_id}' ${duration} group by project_id)
            select project_id, EXTRACT(epoch FROM total_billable_hours) as "total_billable_hours", EXTRACT(epoch FROM total_time) as "total_time" from q1 full join q2 using (project_id);`
      );
      return data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async getProjectActivitiesByProjectId(where) {
    try {
      const { rows: projectSubtasks, count } = await this.subTaskModel.findAndCountAll({
        ...where,
        order: [['subtask_date', 'DESC']],
        attributes: ['id', 'total_time', 'subtask_date', 'discription'],
        include: [
          {
            model: Task,
            attributes: ['id', 'task_name'],
            required: false,
            as: 'task',
          },
          {
            model: User,
            attributes: ['id', 'first_name', 'last_name'],
            required: false,
            as: 'user',
          },
          {
            model: Tag,
            attributes: ['id', 'tag_name'],
            required: false,
            as: 'subtasktag',
          },
        ],
        distinct: true,
      });
      return { projectSubtasks, count };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
