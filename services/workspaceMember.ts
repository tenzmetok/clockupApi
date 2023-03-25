import Container, { Service, Inject } from 'typedi';
import { workSpaceById } from '../controllers/workspace';
import WorkspaceMember from '../models/workspace_member';
import { IWorkspaceMember, IWorkSpace, IWorkspaceMemberInput, IWorkspaceMemberForEmail } from '../types/WorkSpace';
import { Op } from 'sequelize';
import WorkspaceMemberRoleService from './workspaceMemberRole';
import WorkspaceMemberRole from '../models/workspace_member_role';
import RegistrationService from './registration';
import { MEMBER_STATUS } from '../utils/commonConstants';

@Service()
export default class WorkspaceMemberService {
  constructor(
    @Inject('WorkspaceMemberModel')
    private workspaceMemberModel: typeof WorkspaceMember,
    @Inject('WorkspaceMemberRoleModel')
    @Inject('logger')
    private logger
  ) {}

  public async addWorkspaceMember(body): Promise<{ workspace: IWorkSpace }> {
    try {
      const { workspace_id, email, user_id, created_by, updated_by } = body;
      const workspace = await workSpaceById(body.workspace_id);
      const RegistrationServiceInstance = Container.get(RegistrationService);
      const response = await RegistrationServiceInstance.getEmailById(user_id);

      const where = { workspace_id };
      if (email) {
        where['email'] = email;
        where['user_id'] = null;
      }

      if (user_id) {
        where['user_id'] = user_id;
        where['email'] = response.email;
      }

      const a = await this.workspaceMemberModel.findOrCreate({
        where,
        defaults: body,
      });

      if (user_id === workspace.owner_id.toString()) {
        const roles = {
          role: ['Owner'],
          workspace_member_id: a[0].id,
          can_edit: true,
          can_delete: true,
          created_by,
          updated_by,
        };
        const roleServiceInstance = Container.get(WorkspaceMemberRoleService);
        await roleServiceInstance.addRole(roles);
      } else {
        const roles = {
          role: ['WorkspaceMember'],
          workspace_member_id: a[0].id,
          can_edit: false,
          can_delete: false,
          created_by,
          updated_by,
        };
        const roleServiceInstance = Container.get(WorkspaceMemberRoleService);
        await roleServiceInstance.addRole(roles);
      }
      return { workspace };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getWorkspaceMemberById(id) {
    try {
      const data = await this.workspaceMemberModel.findOne({
        where: {
          id,
        },
      });

      return data;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updateWorkspaceMember(body: IWorkspaceMemberInput): Promise<{ workspace: IWorkSpace }> {
    try {
      await this.workspaceMemberModel.update(body, {
        where: {
          [Op.or]: [
            {
              user_id: { [Op.eq]: body.user_id },
            },
            {
              email: { [Op.eq]: body.email },
              workspace_id: { [Op.eq]: body.workspace_id },
            },
            {
              id: { [Op.eq]: body.id },
            },
          ],
        },
      });

      const workspace = await workSpaceById(body.workspace_id);
      return { workspace };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async removeMember(id: any): Promise<number> {
    try {
      const isRemoved = await this.workspaceMemberModel.destroy({ where: id });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getMemberEmailById(workspace_member_id) {
    try {
      const data = await this.workspaceMemberModel.findOne({
        where: {
          id: workspace_member_id,
        },
      });

      return data.email;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getWorkspaceMember(opArgs, where = {}): Promise<IWorkspaceMember[]> {
    try {
      const data = await this.workspaceMemberModel.findAll({
        ...opArgs,
        ...where,

        include: [
          {
            model: WorkspaceMemberRole,
            attributes: ['role'],
          },
        ],
      });
      return data;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getWorkSpaceMemberByWorkspaceIdAndUserId(where = {}): Promise<IWorkspaceMember> {
    try {
      const workSpaceMember = await this.workspaceMemberModel.findOne({ where, raw: true });
      return workSpaceMember;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getWorkSpaceMemberByWorkspaceIdAndUserEmail(where = {}): Promise<IWorkspaceMember> {
    try {
      const workSpaceMember = await this.workspaceMemberModel.findOne({ where, raw: true });
      return workSpaceMember;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getAllWorkspaceMember({ workspace_id }): Promise<IWorkspaceMemberForEmail[]> {
    try {
      const members = await this.workspaceMemberModel.findAll({
        attributes: ['id', 'email', 'user_id'],
        where: {
          workspace_id,
          status: MEMBER_STATUS.accepted,
          email: {
            [Op.ne]: null,
          },
        },
      });
      return members;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
