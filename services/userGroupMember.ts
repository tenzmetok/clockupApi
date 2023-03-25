import { Inject, Service } from 'typedi';
import UserGroupMember from '../models/user_group_member';
@Service()
export default class UserGroupMemberService {
  constructor(
    @Inject('UserGroupMemberModel') private userGroupMemberModel: typeof UserGroupMember,
    @Inject('logger') private logger
  ) {}

  public async addUserGroupMember(body): Promise<boolean> {
    try {
      const members = await this.userGroupMemberModel.bulkCreate(body, { ignoreDuplicates: false });
      return members ? true : false;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getGroupMemberIdsByGroupId(group_id) {
    try {
      const members = await this.userGroupMemberModel.findAll({
        attributes: ['workspace_member_id'],
        where: {
          group_id,
        },
      });
      return members;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async removeGroupMember(body): Promise<number> {
    try {
      const { workspace_member_id, group_id } = body;
      const opArgs = {};
      if (workspace_member_id && group_id) {
        opArgs['workspace_member_id'] = workspace_member_id;
        opArgs['group_id'] = group_id;
      }
      if (!workspace_member_id && group_id) {
        opArgs['group_id'] = group_id;
      }
      const isUserGroupRemoved = await this.userGroupMemberModel.destroy({
        where: opArgs,
      });
      return isUserGroupRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
