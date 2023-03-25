import { Service, Inject, Container } from 'typedi';
import Task from '../models/task';
import { ITask } from '../types/Task';
import SubTaskService from './sub_task';
@Service()
export default class TaskService {
  constructor(@Inject('TaskModel') private taskModel: typeof Task, @Inject('logger') private logger) {}

  public async addTask(body): Promise<boolean> {
    try {
      const { task_name, project_id } = body;
      const isAdded = await this.taskModel.findOrCreate({
        where: { task_name, project_id },
        defaults: body,
      });
      return isAdded[1];
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getTask(where = {}): Promise<{ task: ITask }> {
    try {
      const task = await this.taskModel.findOne({ where, raw: true });
      return { task };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getFilteredTasks(opArgs, where = {}): Promise<{ task: ITask[]; count: number }> {
    try {
      const { rows: task, count } = await this.taskModel.findAndCountAll({ ...opArgs, ...where });
      return { task, count };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async removeTask(id: { id: number }): Promise<number> {
    try {
      const subTaskServiceInstance = Container.get(SubTaskService);
      await subTaskServiceInstance.removeSubTaskByTaskId([id]);
      const isRemoved = await this.taskModel.destroy({ where: id });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updateTask(body): Promise<number> {
    try {
      const { id, task_name, archive_status, project_id, highlighted, assignee_id } = body;
      const opArgs = {
        id,
        highlighted,
        assignee_id,
      };
      if (task_name) {
        const isExist = await this.taskModel.findOne({
          where: {
            task_name,
            project_id,
          },
        });
        if (isExist) {
          return 0;
        }
        opArgs.task_name = task_name;
      }
      if (archive_status !== undefined) {
        opArgs.archive_status = archive_status;
      }
      const [isUpdated] = await this.taskModel.update(opArgs, {
        where: { id },
      });
      return isUpdated;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async removeTaskByProjectId(id: { id: number }): Promise<number> {
    try {
      const getAllTaskByProjectId = await this.taskModel.findAll({
        where: { project_id: id },
        raw: true,
      });
      const subTaskServiceInstance = Container.get(SubTaskService);
      await subTaskServiceInstance.removeSubTaskByTaskId(getAllTaskByProjectId);

      const isRemoved = await this.taskModel.destroy({
        where: {
          project_id: id,
        },
      });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
