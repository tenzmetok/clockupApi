import { Service, Inject } from 'typedi';
import ProjectMemberGroup from '../models/project_member_group';
import Project from '../models/project';
import UserGroup from '../models/user_group';
import { IProjectMemberGroupInput, IProjectInput } from '../types/Project';
import UserGroupMember from '../models/user_group_member';
import WorkspaceMember from '../models/workspace_member';
import User from '../models/user';

@Service()
export default class ProjectMemberGroupService {
  constructor(
    @Inject('ProjectModel') private ProjectModel: typeof Project,
    @Inject('ProjectMemberGroupModel') private ProjectMemberGroupModel: typeof ProjectMemberGroup,
    @Inject('logger') private logger
  ) {}

  public async addProjectMemberGroup(body): Promise<IProjectMemberGroupInput[]> {
    try {
      const projectMemberGroup = await this.ProjectMemberGroupModel.bulkCreate(body);

      return projectMemberGroup;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getProjectMemberGroupByProjectId(where = {}): Promise<{ projectMemberGroup: IProjectInput }> {
    try {
      const projectMemberGroup = await this.ProjectModel.findOne({
        where,
        include: [
          {
            model: UserGroup,
            as: 'projectGroup',
            through: { model: ProjectMemberGroup },
            include: [
              {
                model: WorkspaceMember,
                as: 'UserGroupMember',
                include: [{ model: User, as: 'WorkspaceMember' }],
                through: { model: UserGroupMember },
              },
            ],
          },
        ],
      });
      return { projectMemberGroup };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async removeProjectMemberGroupById(opArgs): Promise<number> {
    try {
      const isRemoved = await this.ProjectMemberGroupModel.destroy({
        where: opArgs,
      });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
