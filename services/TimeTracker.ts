import { Service, Inject } from 'typedi';
import Project from '../models/project';
import Client from '../models/client';
import Task from '../models/task';
import SubTask from '../models/sub_task';
import { ITimetrackerInput } from '../types/TimeTracker';
import SubTaskTag from '../models/sub_task_tag';
import { Op } from 'sequelize';
import Tag from '../models/tag';

@Service()
export default class TimeTrackerService {
  constructor(
    @Inject('ClientModel') private clientModel: typeof Client,
    @Inject('SubTaskModel') private SubTaskModel: typeof SubTask,
    @Inject('SubTaskTagModel') private SubTaskTagModel: typeof SubTaskTag,
    @Inject('logger')
    private logger
  ) {}
  public async getTimeTrackerTasks(opArgs, where = {}) {
    try {
      const { rows: timeTrackerTasks, count } = await this.clientModel.findAndCountAll({
        where: {
          workspace_id: opArgs.workspace_id,
        },
        include: [
          {
            model: Project,
            attributes: ['id', 'name', 'highlighted', 'color', 'billing_status'],
            required: false,
            as: 'project',
            include: [
              {
                model: Task,
                attributes: ['id', 'task_name', 'highlighted'],
                required: false,
                as: 'Tasks',
              },
            ],
          },
        ],
      });

      return { timeTrackerTasks, count };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async addSubTask(body): Promise<{ subTaskData: ITimetrackerInput }> {
    try {
      const subTaskData = await this.SubTaskModel.create(body);
      return { subTaskData };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async addSubTaskTags(body): Promise<{ subTaskTagData: ITimeTrackerTagsInput }> {
    try {
      const subTaskTagData = await this.SubTaskTagModel.bulkCreate(body);
      return { subTaskTagData };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async updateSubTask(body): Promise<number> {
    const { workspace_id, user_id } = body;
    try {
      const [isUpdated] = await this.SubTaskModel.update(body, {
        where: { user_id, workspace_id, is_running: true },
      });
      return isUpdated;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async updateSubTaskList(body, subTaskId): Promise<number> {
    try {
      const [isUpdated] = await this.SubTaskModel.update(body, { where: { [Op.or]: subTaskId } });
      return isUpdated;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async updateSubTaskTagsOfList(subTaskTags, subTaskId) {
    try {
      await this.SubTaskTagModel.destroy({ where: { [Op.or]: subTaskId } });
      let updatedSubTaskTagsData = [];
      if (subTaskTags[0].tag_id) {
        updatedSubTaskTagsData = await this.SubTaskTagModel.bulkCreate(subTaskTags);
      }
      return { updatedSubTaskTagsData };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async removeSubTask(body: any): Promise<number> {
    try {
      const isRemoved = await this.SubTaskModel.destroy({ where: { [Op.or]: body } });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async removeSubTaskTags(body: any): Promise<number> {
    try {
      const isRemoved = await this.SubTaskTagModel.destroy({ where: { [Op.or]: body } });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getSubTasks(opArgs) {
    try {
      const { workspace_id, weekEndDate, weekStartDate } = opArgs;
      const { rows: subTasksData, count } = await this.SubTaskModel.findAndCountAll({
        where: {
          workspace_id,
          is_running: false,
          subtask_date: { [Op.between]: [weekStartDate, weekEndDate] },
        },
        include: [
          {
            model: Project,
            attributes: ['id', 'name', 'color', 'highlighted', 'billing_status'],
            required: false,
            as: 'project',
          },
          {
            model: Client,
            attributes: ['id', 'name'],
            required: false,
            as: 'client',
          },
          {
            model: Task,
            attributes: ['id', 'task_name', 'highlighted'],
            required: false,
            as: 'task',
          },
          {
            model: Tag,
            attributes: ['id', 'tag_name'],
            required: false,
            as: 'subtasktag',
            through: {
              model: SubTaskTag,
              attributes: ['id'],
            },
          },
        ],
        group: [
          'client.id',
          'SubTask.id',
          'project.id',
          'subtasktag->sub_task_tags"."id"',
          'subtasktag.id',
          'task.id',
          'subtask_date',
        ],
        order: [['subtask_date', 'DESC']],
      });
      return { subTasksData, count };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getRunningSubTask(body, where = {}) {
    try {
      const { user_id, workspace_id } = body;
      const runningSubTask = await this.SubTaskModel.findOne({
        where: {
          user_id,
          workspace_id,
          is_running: true,
        },
        include: [
          {
            model: Project,
            attributes: ['id', 'name', 'color', 'highlighted'],
            required: false,
            as: 'project',
          },
          {
            model: Client,
            attributes: ['id', 'name'],
            required: false,
            as: 'client',
          },
          {
            model: Task,
            attributes: ['id', 'task_name', 'highlighted'],
            required: false,
            as: 'task',
          },
          {
            model: Tag,
            attributes: ['id', 'tag_name'],
            required: false,
            as: 'subtasktag',
            through: {
              model: SubTaskTag,
              attributes: ['id'],
            },
          },
        ],
      });
      return { runningSubTask };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getLatestProjectId(opArgs) {
    try {
      const subTasks = await this.SubTaskModel.findAll({
        ...opArgs,
      });
      return subTasks;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getSummaryReport(opArgs) {
    try {
      const { rows: summaryReportData, count } = await this.SubTaskModel.findAndCountAll({
        ...opArgs,
        include: [
          {
            model: Project,
            attributes: ['name', 'visiblity_status', 'bill_rate'],
            required: false,
            as: 'project',
          },
          {
            model: Task,
            attributes: ['task_name'],
            as: 'task',
          },
          {
            model: Tag,
            attributes: ['tag_name'],
            as: 'subtasktag',
            through: {
              model: SubTaskTag,
            },
          },
        ],
        distinct: true,
      });
      return { summaryReportData, count };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
