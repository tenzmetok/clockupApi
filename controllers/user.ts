import { Container } from 'typedi';
import UserService from '../services/user';
import bcrypt from 'bcryptjs';

const getUser = async id => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getClient with param: %o', id);
  try {
    const UserServiceInstance = Container.get(UserService);
    const { user } = await UserServiceInstance.getUser({ id });
    if (!user) {
      throw new Error('Record Not Found');
    }
    return user;
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};

const getUsersExceptWorkspaceMember = async ids => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getUsersExceptWorkspaceMember with param: %o', ids);
  try {
    const UserServiceInstance = Container.get(UserService);
    const { user } = await UserServiceInstance.getUsersExceptWorkspaceMember(ids);
    if (!user) {
      throw new Error('Record Not Found');
    }
    return user;
  } catch (e) {
    logger.error('🔥 error while getting users except workspace Member: %o', e);
    return e;
  }
};

const updateUser = async (id, body) => {
  const logger: any = Container.get('logger');
  logger.debug(`Calling updateClient with id ${id}: and body %o`, body);
  try {
    const UserServiceInstance = Container.get(UserService);
    const { password, oldPassword, ctx_user_password } = body;

    if (password) {
      const match = await bcrypt.compare(oldPassword, ctx_user_password);
      if (!match) return false;
      const hash = await bcrypt.hash(password, 6);
      body['password'] = hash;
    }
    const isUserUpdated = await UserServiceInstance.updateUser(body, { id });
    return isUserUpdated;
  } catch (e) {
    logger.error('🔥 error: %o', e);
  }
};
export { getUser, updateUser, getUsersExceptWorkspaceMember };
