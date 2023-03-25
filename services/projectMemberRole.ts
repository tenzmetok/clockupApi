import { Service, Inject } from 'typedi';
import ProjectMemberRole from '../models/project_member_role';
import { ROLE } from '../utils/commonConstants';

@Service()
export default class ProjectMemberRoleService {
  constructor(
    @Inject('ProjectMemberRoleModel') private ProjectMemberRoleModel: typeof ProjectMemberRole,
    @Inject('logger') private logger
  ) {}

  public async addProjectMemberRole(body): Promise<boolean> {
    try {
      const { role, project_member_id, created_by, updated_by } = body;
      const project = await this.ProjectMemberRoleModel.findOrCreate({
        where: { role: role || ROLE.Member, project_member_id },
        defaults: { role, project_member_id, created_by, updated_by },
      });
      return project[1];
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updateProjectMemberRole(body, where = {}): Promise<number> {
    try {
      const [isUpdatedRole] = await this.ProjectMemberRoleModel.update(body, {
        where,
      });
      return isUpdatedRole;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getProjectMemberIdInProjectMember(id) {
    try {
      const projectMembers = await this.ProjectMemberRoleModel.findAll({
        where: {
          project_member_id: id,
          role: 'Manager',
        },
      });
      return projectMembers;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getProjectMemberRoleByProjectIds(where = []) {
    try {
      const projectIds = where.map(item => item.id);
      const projectMemberRoles = await this.ProjectMemberRoleModel.findAll({
        where: {
          project_member_id: projectIds,
        },
      });
      return projectMemberRoles;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async updateProjectmemberById(body, where = []): Promise<number> {
    try {
      const task_idArray = where.map(item => item.id);
      const [isUpdated] = await this.ProjectMemberRoleModel.update(body, {
        where: {
          project_member_id: task_idArray,
        },
      });
      return isUpdated[1];
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async removeProjectMemberRole(id): Promise<number> {
    try {
      const project_member_id = id;
      const isRemoved = await this.ProjectMemberRoleModel.destroy({
        where: { project_member_id },
      });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async removeProjectMemberRoles(id = []): Promise<number> {
    try {
      const isRemoved = await this.ProjectMemberRoleModel.destroy({
        where: { project_member_id: id },
      });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async removeProjectMemberRoleById(where = []): Promise<number> {
    try {
      const projectMemberRoleIds = where.map(item => item.id);
      const isRemoved = await this.ProjectMemberRoleModel.destroy({
        where: {
          project_member_id: projectMemberRoleIds,
        },
      });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
