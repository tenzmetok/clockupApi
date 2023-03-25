import { Container } from 'typedi';
import UserService from '../services/user';
import jwt from 'jsonwebtoken';
import config from '../config';

export default async function verifyEmail(token) {
  const logger: any = Container.get('logger');
  logger.debug(`Calling verifyEmail with token %o`);
  try {
    const { token: verifyToken } = token;
    const decoded = await jwt.verify(verifyToken, config.jwtSecret);
    const UserServiceInstance = Container.get(UserService);
    const body = { is_confirm: true };
    const isEmailVerified = await UserServiceInstance.updateUser(body, { id: decoded.id });
    return isEmailVerified;
  } catch (e) {
    logger.error('🔥 error: %o', e);
  }
}
