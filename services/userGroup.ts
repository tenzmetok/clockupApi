import { Service, Inject } from 'typedi';
import UserGroup from '../models/user_group';
import { IuserGroup, IuserGroupInput } from '../types/UserGroup';

@Service()
export default class UserGroupService {
  constructor(@Inject('UserGroupModel') private userGroupModel: typeof UserGroup, @Inject('logger') private logger) {}

  public async getUserGroups(where = {}): Promise<{ userGroupData: IuserGroup[] }> {
    try {
      const userGroupData = await this.userGroupModel.findAll({ where, attributes: ['id', 'group_name'] });
      return { userGroupData };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async addUserGroup(body: IuserGroupInput): Promise<boolean> {
    try {
      const { group_name, workspace_id } = body;
      const group = await this.userGroupModel.findOrCreate({
        where: {
          group_name,
          workspace_id,
        },
        defaults: body,
      });
      return group[1];
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updateUserGroup(body: IuserGroupInput): Promise<number> {
    try {
      const { id, workspace_id, group_name } = body;
      const opArgs = {
        id,
        workspace_id,
      };
      if (group_name) {
        const isExist = await this.userGroupModel.findOne({ where: { group_name, workspace_id } });
        if (!isExist) {
          opArgs['group_name'] = group_name;
        } else {
          return 0;
        }
      }
      const [isUpdated] = await this.userGroupModel.update(opArgs, {
        where: { id, workspace_id },
      });
      return isUpdated;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async removeUserGroup(id: { id: number }): Promise<number> {
    try {
      const isRemoved = await this.userGroupModel.destroy({ where: id });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
