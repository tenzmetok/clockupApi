import { Service, Inject } from 'typedi';
import Workspace from '../models/workspace';
import { IWorkSpace, IWorkSpaceInput } from '../types/WorkSpace';
import { Op } from 'sequelize';
import User from '../models/user';
import WorkspaceMember from '../models/workspace_member';

@Service()
export default class WorkSpaceService {
  constructor(@Inject('WorkspaceModel') private workSpaceModel: typeof Workspace, @Inject('logger') private logger) {}
  public async addWorkSpace(body: IWorkSpaceInput): Promise<{ workSpace: IWorkSpace }> {
    try {
      const [workSpace, created] = await this.workSpaceModel.findOrCreate({
        where: { owner_id: body.owner_id, workspace_name: body.workspace_name },
        defaults: body,
      });
      if (created) return { workSpace };
      throw 'Workspace already exist!';
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getWorkSpaceByOwnerId(where = {}): Promise<{ workSpace: IWorkSpaceInput[] }> {
    try {
      const workSpace = await this.workSpaceModel.findAll({ where, raw: true });
      return { workSpace };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getWorkSpaceByName(where): Promise<{ WorkSpace: IWorkSpace }> {
    try {
      const WorkSpace = await this.workSpaceModel.findOne({ where, raw: true });
      return { WorkSpace };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getWorkSpaceById(where): Promise<{ WorkSpace: IWorkSpace }> {
    try {
      const WorkSpace = await this.workSpaceModel.findOne({
        where: { id: { [Op.eq]: where.id } },
        include: [
          {
            model: User,
            attributes: ['id', 'first_name', 'last_name', 'email'],
            as: 'Member',
          },
        ],
      });
      return { WorkSpace };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getWorkSpaceMember(workspace_id): Promise<{ workspace: IWorkSpace }> {
    try {
      const workspace = await this.workSpaceModel.findOne({
        where: { id: { [Op.eq]: workspace_id } },
        include: [
          {
            model: User,
            attributes: ['id', 'first_name', 'last_name', 'email'],
            as: 'Member',
            through: {
              model: WorkspaceMember,
              attributes: ['id', 'status'],
            },
          },
        ],
        attributes: ['owner_id'],
      });
      return { workspace };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updateWorkSpace(body: IWorkSpaceInput): Promise<number> {
    try {
      const [isUpdated] = await this.workSpaceModel.update(body, {
        where: {
          id: body.id,
          owner_id: body.owner_id,
        },
      });
      return isUpdated;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
