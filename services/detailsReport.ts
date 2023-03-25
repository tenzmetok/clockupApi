import { Service, Inject } from 'typedi';
import SubTask from '../models/sub_task';
import Tag from '../models/tag';
import Client from '../models/client';
import SubTaskTag from '../models/sub_task_tag';
import Project from '../models/project';
import User from '../models/user';

@Service()
export class DetailsReportService {
  constructor(
    @Inject('SubTaskModel') private subtaskModel: typeof SubTask,
    @Inject('SubTaskTagModel') private subtasktagModel: typeof SubTaskTag,
    @Inject('logger') private logger
  ) {}

  public async getsubTask(opArgs) {
    try {
      const { rows: subtaskData, count } = await this.subtaskModel.findAndCountAll({
        ...opArgs,
        include: [
          {
            model: Client,
            attributes: ['name'],
            required: false,
            as: 'client',
          },
          {
            model: Project,
            attributes: ['name', 'visiblity_status', 'bill_rate'],
            required: false,
            as: 'project',
          },
          {
            model: User,
            attributes: ['first_name', 'last_name'],
            required: false,
            as: 'user',
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
      return { subtaskData, count };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getLatestProjectDetails(opArgs) {
    try {
      const subTasks = await this.subtaskModel.findAll({
        ...opArgs,
      });
      return subTasks;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
