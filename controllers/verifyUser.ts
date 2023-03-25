import { Container } from 'typedi';
import WorkspaceMemberService from '../services/workspaceMember';
import jwt from 'jsonwebtoken';
import config from '../config';
import { updateUser } from './user';

export default async function verifyUser(id) {
  const logger: any = Container.get('logger');
  logger.debug(`Calling verifyEmail with token %o`);
  try {
    const { id: verifyToken } = id;
    const decoded = await jwt.verify(verifyToken, config.jwtSecret);
    const workspaceMemberServiceInstance = Container.get(WorkspaceMemberService);
    const workspaceMemberDetail = await workspaceMemberServiceInstance.getWorkspaceMemberById(decoded.id);
    const user_id = workspaceMemberDetail?.user_id || '';

    const body = {
      id: workspaceMemberDetail.id,
      status: 'Accepted',
    };
    const workspace = await workspaceMemberServiceInstance.updateWorkspaceMember(body);
    await updateUser(user_id, {
      current_workspace: decoded?.workspace_id,
    });
    if (workspace) return true;
    return false;
  } catch (e) {
    logger.error('🔥 error: %o', e);
  }
}
