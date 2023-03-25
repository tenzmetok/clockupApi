import { Container } from 'typedi';
import RegistrationService from '../services/registration';
const bcrypt = require('bcryptjs');
import jwt_decode from 'jwt-decode';
import { updateWorkspaceMember } from './workspace';
import { MEMBER_STATUS } from '../utils/commonConstants';
import confirmTemplateForNewUser from '../assets/ConfirmTemplateForNewUser';
import { sendEmail } from '../services/aws';
import config from '../config/index';
import { updateUser } from './user';

const registerUser = async (body, token) => {
  const logger: any = Container.get('logger');
  logger.debug('Calling registerUser with body: %o', body);
  try {
    const RegistrationServiceInstance = Container.get(RegistrationService);
    const hash = await bcrypt.hash(body.password, 12);
    body['password'] = hash;
    const { user, isUserRegistered } = await RegistrationServiceInstance.registerUser(body);

    if (isUserRegistered) {
      const emailConfirmTemplate = await confirmTemplateForNewUser(user.id, user.first_name, user.email);
      const params = {
        from: config.senderEmail,
        to: [body?.email],
        Subject: {
          Charset: 'UTF-8',
          Data: emailConfirmTemplate.subject,
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: emailConfirmTemplate.html,
          },
          Text: {
            Charset: 'UTF-8',
            Data: emailConfirmTemplate.text,
          },
        },
      };
      await sendEmail(params);
    }

    if (token) {
      const { workspace_id, email } = jwt_decode(token);
      await updateWorkspaceMember({
        workspace_id: parseInt(workspace_id, 10),
        user_id: user.id,
        email: email,
        status: MEMBER_STATUS.accepted,
      });
      await updateUser(user.id, {
        current_workspace: workspace_id,
      });
    }
    return { isUserRegistered };
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};

export { registerUser };
