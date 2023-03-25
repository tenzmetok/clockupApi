import { Integer } from 'aws-sdk/clients/apigateway';
import { Service, Inject } from 'typedi';
import User from '../models/user';

@Service()
export default class ForgotPasswordService {
  constructor(@Inject('UserModel') private userModel: typeof User, @Inject('logger') private logger) {}

  public async getUserbyEmail(emailId): Promise<Integer> {
    try {
      const userData = await this.userModel.findOne({ where: { email: emailId.email } });
      if (userData) return userData.id;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
