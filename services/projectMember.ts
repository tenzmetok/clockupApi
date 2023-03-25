import { Service, Inject, Container } from 'typedi';
import ProjectMember from '../models/project_member';
import User from '../models/user';
import WorkspaceMember from '../models/workspace_member';
import Project from '../models/project';
import { IProjectInput, IProjectMemberInput } from '../types/Project';
import { MEMBER_STATUS } from '../utils/commonConstants';
import ProjectMemberRole from '../models/project_member_role';
import ProjectMemberRoleService from './projectMemberRole';
@Service()
export default class ProjectMemberService {
  constructor(
    @Inject('ProjectModel') private ProjectModel: typeof Project,
    @Inject('ProjectMemberModel') private ProjectMemberModel: typeof ProjectMember,
    @Inject('logger') private logger
  ) {}

  public async getProjectMemberByProjectId(where = {}): Promise<{ projectMembers: IProjectInput }> {
    try {
      const projectMembers = await this.ProjectModel.findOne({
        where,
        include: [
          {
            model: WorkspaceMember,
            where: { status: MEMBER_STATUS.accepted },
            attributes: ['id', 'email', 'user_id'],
            as: 'workspaceProjectMembers',
            through: {
              model: ProjectMember,
            },
            include: [
              {
                model: User,
                attributes: ['id', 'email', 'first_name', 'last_name'],
                as: 'WorkspaceMember',
              },
            ],
          },
          {
            model: ProjectMember,
            as: 'projectMembers',
            include: [{ model: ProjectMemberRole, as: 'projectMemberRole' }],
          },
        ],
      });
      return { projectMembers };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async addProjectMember(body): Promise<IProjectMemberInput[]> {
    try {
      const project = await this.ProjectMemberModel.bulkCreate(body);
      return project;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async addSingleProjectMember(body): Promise<boolean> {
    try {
      const { workspace_member_id, project_id, role, created_by, updated_by } = body;
      const project = await this.ProjectMemberModel.findOrCreate({
        where: {
          workspace_member_id,
          project_id,
        },
        defaults: body,
      });
      if (project[1]) {
        const projectMemberServiceInstance = Container.get(ProjectMemberService);
        const hasMember = await projectMemberServiceInstance.getProjectMemberByProjectIdAndWorkspaceMemberId({
          workspace_member_id,
          project_id,
        });
        const projectMemberRoleServiceInstance = Container.get(ProjectMemberRoleService);
        await projectMemberRoleServiceInstance.addProjectMemberRole({
          role: role,
          project_member_id: hasMember.id,
          created_by,
          updated_by,
        });
      }

      return project[1];
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async removeProjectMember(body): Promise<number> {
    try {
      const { workspace_member_id, project_id } = body;
      const projectMemberServiceInstance = Container.get(ProjectMemberService);
      const projectMemberRoleServiceInstance = Container.get(ProjectMemberRoleService);
      const hasMember = await projectMemberServiceInstance.getProjectMemberByProjectIdAndWorkspaceMemberId(body);
      if (hasMember) {
        await projectMemberRoleServiceInstance.removeProjectMemberRole(hasMember.id);
      }
      const isRemoved = await this.ProjectMemberModel.destroy({
        where: {
          workspace_member_id,
          project_id,
        },
      });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async removeProjectMemberByProjectId(id: { id: number }): Promise<number> {
    try {
      const getAllProjectMemberByProjectId = await this.ProjectMemberModel.findAll({
        where: { project_id: id },
        raw: true,
      });
      const projectMemberRoleServiceInstance = Container.get(ProjectMemberRoleService);
      await projectMemberRoleServiceInstance.removeProjectMemberRoleById(getAllProjectMemberByProjectId);
      const isRemoved = await this.ProjectMemberModel.destroy({
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
  public async getWorkspaceMemberIdInProjectMember(id): Promise<boolean> {
    try {
      const projectMembers = await this.ProjectMemberModel.findOne({
        where: {
          workspace_member_id: id,
        },
      });
      if (projectMembers) return true;
      else return false;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getProjectMemberByMemberIds(where = []) {
    try {
      const projectMembers = await this.ProjectMemberModel.findAll({
        where: {
          id: where,
        },
      });
      return projectMembers;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getProjectMemberByManagerIds(where = []) {
    try {
      const projectMembers = await this.ProjectMemberModel.findAll({
        where: {
          id: where,
        },
      });
      return projectMembers;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async removeProjectMembers(where = []): Promise<number> {
    try {
      const task_idArray = where.map(item => item.id);
      const projectMemberRoleServiceInstance = Container.get(ProjectMemberRoleService);
      await projectMemberRoleServiceInstance.removeProjectMemberRoles(task_idArray);

      const isRemoved = await this.ProjectMemberModel.destroy({
        where: {
          id: task_idArray,
        },
      });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getProjectMemberByProjectIdAndWorkspaceMemberId(where = {}): Promise<IProjectMemberInput> {
    try {
      const projectMembers = await this.ProjectMemberModel.findOne({ where, raw: true });
      return projectMembers;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getWorkspaceMemberIdByProjectId(id): Promise<IProjectMemberInput[]> {
    try {
      const projectMemberId = await this.ProjectMemberModel.findAll({
        where: {
          id: id,
        },
      });
      return projectMemberId;
    } catch (err) {
      console.log(err);
    }
  }

  public async getProjectMemberIdByWorkspaceMemberId(id): Promise<IProjectMemberInput[]> {
    try {
      const projectMemberId = await this.ProjectMemberModel.findAll({
        where: {
          workspace_member_id: id,
        },
      });
      return projectMemberId;
    } catch (err) {
      console.log(err);
    }
  }
  public async getProjectMemberIdGroupByWorkspaceMemberId(where = []): Promise<IProjectMemberInput[]> {
    try {
      const member_idArray = where.map(item => item.id);
      const projectMemberId = await this.ProjectMemberModel.findAll({
        where: {
          workspace_member_id: member_idArray,
        },
        include: [
          {
            model: ProjectMemberRole,
            attributes: ['role'],
            as: 'projectMemberRole',
          },
        ],
      });
      return projectMemberId;
    } catch (err) {
      console.log(err);
    }
  }
}
