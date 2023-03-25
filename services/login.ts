import { Service, Inject } from 'typedi';
import User from '../models/user';
import Workspace from '../models/workspace';
import WorkspaceMember from '../models/workspace_member';
import WorkspaceMemberRole from '../models/workspace_member_role';
import { ILogin, ILoginInput } from '../types/Login';
import { MEMBER_STATUS } from '../utils/commonConstants';
@Service()
export default class LoginService {
  constructor(@Inject('UserModel') private userModel: typeof User, @Inject('logger') private logger) {}

  public async getUser(where = {}): Promise<{ user: ILogin }> {
    try {
      const user = await this.userModel.findOne({
        where,
        include: [
          {
            model: WorkspaceMember,
            as: 'WorkspaceMember',
            required: false,
            where: { status: MEMBER_STATUS.accepted },

            include: [
              {
                model: WorkspaceMemberRole,
                as: 'WorkspaceMemberRole',
                attributes: ['id', 'workspace_member_id', 'role'],
              },
              {
                model: Workspace,
                attributes: ['id', 'workspace_name', 'owner_id'],
              },
            ],
          },
        ],
      });
      return { user };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async Login(where = {}): Promise<{ user: ILoginInput }> {
    try {
      const user = await this.userModel.findOne({
        where,
        include: [
          {
            model: WorkspaceMember,
            as: 'WorkspaceMember',
            required: false,
            where: { status: MEMBER_STATUS.accepted },

            include: [
              {
                model: WorkspaceMemberRole,
                as: 'WorkspaceMemberRole',
                attributes: ['id', 'workspace_member_id', 'role'],
              },
              {
                model: Workspace,
                attributes: ['id', 'workspace_name', 'owner_id'],
              },
            ],
          },
        ],
      });

      return { user };
    } catch (e) {
      console.error('e >>>>>>>', e);
      this.logger.error(e);
      throw e;
    }
  }
}
