import { Container } from 'typedi';
import UserGroupMemberService from '../services/userGroupMember';
import WorkspaceMemberService from '../services/workspaceMember';
import { intersectionBy } from 'lodash';

const addUserGroupMember = async body => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addUserGroupMember with body: %o', body);
  try {
    const userGroupMemberServiceInstance = Container.get(UserGroupMemberService);
    const isUserGroupMemberAdded = await userGroupMemberServiceInstance.addUserGroupMember(body);
    return isUserGroupMemberAdded;
  } catch (error) {
    logger.error('🔥 error while adding Group members : %o', error);
    return error;
  }
};

const getGroupMembers = async body => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getGroupMembers with body: %o', body);
  try {
    const { workspace_id, group_id } = body;
    const workspaceMemberServiceInstance = Container.get(WorkspaceMemberService);
    const members = await workspaceMemberServiceInstance.getAllWorkspaceMember(workspace_id);

    const userGroupMemberServiceInstance = Container.get(UserGroupMemberService);
    const getAllGroupMemberIds = await userGroupMemberServiceInstance.getGroupMemberIdsByGroupId(group_id);

    const workspaceMemberList = members.map(value => ({ id: value.id, email: value.email }));
    const groupMemberIdList = getAllGroupMemberIds.map(value => ({ id: value.workspace_member_id }));

    const res = intersectionBy(workspaceMemberList, groupMemberIdList, 'id');
    return res;
  } catch (error) {
    logger.error('🔥 error while getting group members by group id: %o', error);
    return error;
  }
};

const removeGroupMember = async (opArgs): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling removeGroupMember with param: %o', opArgs);
  try {
    const userGroupMemberServiceInstance = Container.get(UserGroupMemberService);
    const isUserGroupRemoved = await userGroupMemberServiceInstance.removeGroupMember(opArgs);
    return isUserGroupRemoved;
  } catch (e) {
    logger.error('🔥 error while removing Group Member: %o', e);
    return e;
  }
};
export { addUserGroupMember, getGroupMembers, removeGroupMember };
