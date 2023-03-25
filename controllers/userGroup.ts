import { Container } from 'typedi';
import UserGroupService from '../services/userGroup';
import ProjectMemberGroupService from '../services/projectMemberGroup';
import { getGroupMembers, removeGroupMember } from './userGroupMember';

const addUserGroup = async (body): Promise<boolean> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addUserGroup with body: %o', body);
  try {
    const userGroupServiceInstance = Container.get(UserGroupService);
    const isUserGroupAdded = await userGroupServiceInstance.addUserGroup(body);
    return isUserGroupAdded;
  } catch (e) {
    logger.error('🔥 error while adding userGroup: %o', e);
    return e;
  }
};

const getGroupsByWorkspaceId = async workspace_id => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getUserGroups with param: %o', workspace_id);
  try {
    const userGroupServiceInstance = Container.get(UserGroupService);
    const { userGroupData } = await userGroupServiceInstance.getUserGroups(workspace_id);
    const workspaceGroups = await Promise.all(
      userGroupData.map(async data => {
        const group = data.dataValues;
        group.group_members = await getGroupMembers({ group_id: data.id, workspace_id });
        return group;
      })
    );
    return workspaceGroups;
  } catch (e) {
    logger.error('🔥 error while getting userGroups : %o', e);
    return e;
  }
};

const removeUserGroup = async (body): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling removeUserGroup with param: %o', body);
  try {
    const userGroupServiceInstance = Container.get(UserGroupService);
    await removeGroupMember({ group_id: body.id });
    const ProjectMemberGroupServiceInstance = Container.get(ProjectMemberGroupService);
    await ProjectMemberGroupServiceInstance.removeProjectMemberGroupById({ group_id: body.id });
    const isUserGroupRemoved = await userGroupServiceInstance.removeUserGroup(body);
    return isUserGroupRemoved;
  } catch (e) {
    logger.error('🔥 error while removing userGroup: %o', e);
    return e;
  }
};

const updateUserGroup = async (body): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug(`Calling updateUserGroup with body %o`, body);
  try {
    const userGroupServiceInstance = Container.get(UserGroupService);
    const isUserGroupUpdated = await userGroupServiceInstance.updateUserGroup(body);
    return isUserGroupUpdated;
  } catch (e) {
    logger.error('🔥 error while updating userGroup: %o', e);
    return e;
  }
};

export { addUserGroup, removeUserGroup, updateUserGroup, getGroupsByWorkspaceId };
