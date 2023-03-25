import { Service, Inject } from 'typedi';
import Project from '../models/project';
import Client from '../models/client';
import Workspace from '../models/workspace';
import SubTask from '../models/sub_task';
import { IProject, IProjectInput } from '../types/Project';

@Service()
export default class ProjectService {
  constructor(@Inject('ProjectModel') private projectModel: typeof Project, @Inject('logger') private logger) {}

  public async addProject(body): Promise<IProject | boolean> {
    try {
      const { name, client_id, workspace_id } = body;
      const project = await this.projectModel.findOrCreate({
        where: { name, client_id, workspace_id },
        defaults: body,
      });
      return project[1] ? project[0] : false;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getProjectById(where = {}): Promise<{ project: IProject }> {
    try {
      const project = await this.projectModel.findOne({
        where,
        include: [
          {
            model: Client,
            attributes: ['id', 'name'],
            required: true,
            as: 'client',
          },
        ],
      });
      return { project };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updateProject(body: IProjectInput): Promise<number> {
    try {
      const [isUpdated] = await this.projectModel.update(body, {
        where: { id: body.id, workspace_id: body.workspace_id },
      });
      return isUpdated;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getFilteredProjects(opArgs, where = {}): Promise<{ projects: IProject[]; count: number }> {
    try {
      const { rows: projects, count } = await this.projectModel.findAndCountAll({
        ...opArgs,
        ...where,
        include: [
          {
            model: Client,
            attributes: ['id', 'name'],
            where: opArgs.client_id
              ? {
                  id: opArgs.client_id,
                }
              : {},
            as: 'client',
          },
        ],
      });
      return { projects, count };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async removeProject(id): Promise<number> {
    try {
      const isDeleted = await this.projectModel.destroy({ where: { id } });
      return isDeleted;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getProjectMatrixById(where = {}): Promise<{ project: IProject }> {
    try {
      const project = await this.projectModel.findOne({
        where,
        include: [
          {
            model: Workspace,
            attributes: ['bill_rate', 'currency'],
            required: false,
            as: 'workspace',
          },
          {
            model: SubTask,
            required: false,
            as: 'subtask',
          },
        ],
      });
      return { project };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
