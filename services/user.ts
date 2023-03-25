import { Service, Inject } from 'typedi';
import { Op } from 'sequelize';
import User from '../models/user';
import Workspace from '../models/workspace';
import { IUser, IUserInput } from '../types/User';

@Service()
export default class UserService {
  constructor(@Inject('UserModel') private userModel: typeof User, @Inject('logger') private logger) {}

  public async getUser(where = {}): Promise<{ user: IUser }> {
    try {
      const user = await this.userModel.findOne({
        where,
        include: [
          {
            model: Workspace,
            attributes: ['id', 'workspace_name', 'owner_id'],
            as: 'Workspaces',
          },
        ],
      });
      return { user };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getUsersExceptWorkspaceMember(ids, where = {}): Promise<{ user: IUser[] }> {
    try {
      const user = await this.userModel.findAll({
        where: {
          id: {
            [Op.notIn]: ids,
          },
        },
        attributes: ['first_name', 'last_name', 'email', 'id'],
        raw: true,
      });
      return { user };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updateUser(body: IUserInput, where: any): Promise<number> {
    try {
      const { current_workspace, first_name, last_name, user_logo, password, is_confirm } = body;
      const opArgs = {};
      if (password) {
        opArgs['password'] = password;
      }
      if (current_workspace) {
        opArgs['current_workspace'] = current_workspace;
      }
      if (!current_workspace && !password) {
        opArgs['first_name'] = first_name;
        opArgs['last_name'] = last_name;
        opArgs['user_logo'] = user_logo;
      }
      if (is_confirm) {
        opArgs['is_confirm'] = is_confirm;
      }
      const [isUserUpdated] = await this.userModel.update(opArgs, { where });
      return isUserUpdated;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
