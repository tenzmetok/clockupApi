import { Container } from 'typedi';
import ForgotPasswordService from '../services/forgotPassword';
import ChangePasswordTemplateForUser from '../assets/ChangePasswordTemplateForUser';
import config from '../config/index';
import { sendEmail } from '../services/aws';
const bcrypt = require('bcryptjs');
import { verifyJWT } from '../services/jwtVerify';
import UserService from '../services/user';

const emailExist = async body => {
  const logger: any = Container.get('logger');
  logger.debug('Calling forgotpassword with body: %o', body);

  try {
    const forgotpasswordServiceinstance = Container.get(ForgotPasswordService);
    const userId = await forgotpasswordServiceinstance.getUserbyEmail(body);
    if (!userId) {
      return false;
    } else {
      const userServiceInstance = Container.get(UserService);
      const { user } = await userServiceInstance.getUser(userId);
      const changePasswordEmail = await ChangePasswordTemplateForUser(userId, body.email, user.first_name);
      const params = {
        from: config.senderEmail,
        to: [body?.email],
        Subject: {
          Charset: 'UTF-8',
          Data: changePasswordEmail.subject,
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: changePasswordEmail.html,
          },
          Text: {
            Charset: 'UTF-8',
            Data: changePasswordEmail.text,
          },
        },
      };
      await sendEmail(params);
      return true;
    }
  } catch (e) {
    logger.error('🔥 error: %o', e);
  }
};

const changePassword = async (body, token) => {
  const logger: any = Container.get('logger');
  logger.debug('Calling changePassword with body: %o', body);
  try {
    const UserServiceInstance = Container.get(UserService);
    const hash = await bcrypt.hash(body.password, 12);
    body['password'] = hash;
    const jwtVerify = await verifyJWT(token);
    if (jwtVerify.id) {
      const id = jwtVerify.id;
      const isUserUpdated = await UserServiceInstance.updateUser(body, { id });
      return isUserUpdated;
    }
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};

const verifyToken = async token => {
  const jwtVerify = await verifyJWT(token);
  if (jwtVerify.id) {
    return true;
  } else {
    return false;
  }
};

export { emailExist, changePassword, verifyToken };
