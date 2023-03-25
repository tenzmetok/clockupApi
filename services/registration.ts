import { Inject } from 'typedi';
import User from '../models/user';
import { IUserInput } from '../types/User';

export default class RegistrationService {
  constructor(@Inject('UserModel') private userModel: typeof User, @Inject('logger') private logger) {}

  // Register user
  public async registerUser(body): Promise<{ user: IUserInput; isUserRegistered: boolean }> {
    const { email } = body;
    try {
      const [user, isUserRegistered] = await this.userModel.findOrCreate({ where: { email }, defaults: body });
      return { user, isUserRegistered };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async getEmailById(id) {
    try {
      const details = await this.userModel.findOne({
        where: {
          id,
        },
      });

      return details;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
