import { Service, Inject } from 'typedi';
import WorkspaceMemberRole from '../models/workspace_member_role';
import { IWorkspaceMemberRole, IWorkspaceMemberRoleInput } from '../types/WorkspaceMemberRole';

@Service()
export default class WorkspaceMemberRoleService {
  constructor(
    @Inject('WorkspaceMemberRoleModel')
    private workspaceMemberRoleModel: typeof WorkspaceMemberRole,
    @Inject('logger') private logger
  ) {}
  public async addRole(body: IWorkspaceMemberRoleInput): Promise<boolean> {
    try {
      const { role, workspace_member_id, can_edit, can_delete, created_by, updated_by } = body;
      const role = role.join();
      const [isRoleAdded] = await this.workspaceMemberRoleModel.findOrCreate({
        where: { workspace_member_id },
        defaults: { role, workspace_member_id, can_edit, can_delete, created_by, updated_by },
      });
      return isRoleAdded[1];
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getAllRoles(opArgs, where = {}): Promise<{ roles: IWorkspaceMemberRole[]; count: number }> {
    try {
      const { rows: roles, count } = await this.workspaceMemberRoleModel.findAndCountAll({
        ...opArgs,
        ...where,
      });
      return { roles, count };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async removeMemberRole(id): Promise<number> {
    try {
      const isRemoved = await this.workspaceMemberRoleModel.destroy({ where: { workspace_member_id: id } });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getRoleById(id): Promise<{ role: IWorkspaceMemberRole }> {
    try {
      const role = await this.workspaceMemberRoleModel.findOne({ where: { workspace_member_id: id } });
      return { role };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updateRole(body: IWorkspaceMemberRoleInput): Promise<number> {
    try {
      const { role, workspace_member_id, can_edit, can_delete } = body;
      const roles = role.join();
      const opArgs = {
        role: roles,
        workspace_member_id,
        can_edit,
        can_delete,
      };
      const [isUpdated] = await this.workspaceMemberRoleModel.update(opArgs, { where: { workspace_member_id } });
      return isUpdated;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
