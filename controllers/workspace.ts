import { Container } from 'typedi';
import WorkSpaceService from '../services/workspace';
import WorkspaceMemberService from '../services/workspaceMember';
import UserService from '../services/user';
import { sendEmail } from '../services/aws';
import LoginService from '../services/login';
import config from '../config/index';
import { IWorkSpace, IWorkspaceMember } from '../types/WorkSpace';
import { MEMBER_STATUS } from '../utils/commonConstants';
import inviteMailTemplateForNewUsers from '../assets/InviteTemplateForNewUsers';
import inviteMailTemplateRegisteredUsers from '../assets/InviteTemplateForRegisteredUsers';
import ProjectMemberService from '../services/projectMember';
import WorkspaceMemberRoleService from '../services/workspaceMemberRole';
import { removeGroupMember } from './userGroupMember';

const updateWorkSpace = async body => {
  const logger: any = Container.get('logger');
  logger.debug(`Calling updateWorkspace and body %o`, body);
  try {
    const { user_id } = body;
    const workSpaceServiceInstance = Container.get(WorkSpaceService);

    const { workSpace: isWorkSpaceExist } = await workSpaceServiceInstance.getWorkSpaceByOwnerId({
      owner_id: user_id,
    });
    const value = isWorkSpaceExist.find(item => {
      return item.workspace_name === body.workspace_name && item.id !== parseInt(body.id);
    });

    if (value) {
      return false;
    }
    const isUpdated = await workSpaceServiceInstance.updateWorkSpace(body);
    return isUpdated;
  } catch (e) {
    logger.error('🔥 error while updating Workspace %o', e);
    return e;
  }
};

const workSpaceByOwnerId = async owner_id => {
  const logger: any = Container.get('logger');
  logger.debug('Calling workSpaceByOwnerId with param: %o', owner_id);
  try {
    const workSpaceServiceInstance = Container.get(WorkSpaceService);
    const { workSpace } = await workSpaceServiceInstance.getWorkSpaceByOwnerId({
      owner_id,
    });
    if (!workSpace) {
      throw new Error('Record Not Found');
    }
    return workSpace;
  } catch (e) {
    logger.error('🔥 error while getting workspaceByOwnerId %o', e);
    return e;
  }
};

const addWorkSpace = async body => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addWorkSpace with body: %o', body);
  try {
    const WorkSpaceServiceInstance = Container.get(WorkSpaceService);
    const { workSpace } = await WorkSpaceServiceInstance.addWorkSpace(body);
    return workSpace;
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};

const workSpaceById = async id => {
  const logger: any = Container.get('logger');
  logger.debug('Calling workSpaceById with param: %o', id);
  try {
    const workSpaceServiceInstance = Container.get(WorkSpaceService);
    const { WorkSpace } = await workSpaceServiceInstance.getWorkSpaceById({
      id,
    });
    if (!WorkSpace) {
      throw new Error('Record Not Found');
    }
    return WorkSpace;
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};

const addWorkspaceMember = async body => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addWorkspaceMember with param: %o', body);
  try {
    const workspaceMemberServiceInstance = Container.get(WorkspaceMemberService);
    const workspace = await workspaceMemberServiceInstance.addWorkspaceMember(body);
    return workspace;
  } catch (e) {
    logger.error('🔥 error while adding workspaceMember %o', e);
    return e;
  }
};

const updateWorkspaceMember = async (body): Promise<{ workspace: IWorkSpace }> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling updateWorkspaceMember with param: %o', body);
  try {
    const workspaceMemberServiceInstance = Container.get(WorkspaceMemberService);
    const workspace = await workspaceMemberServiceInstance.updateWorkspaceMember(body);
    return workspace;
  } catch (e) {
    logger.error('🔥 error while updating workspaceMember %o', e);
    return e;
  }
};
const removeMember = async (id): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling removeMember with param: %o', id);
  try {
    const projectMemberServiceInstance = Container.get(ProjectMemberService);
    removeGroupMember({ workspace_member_id: id });
    const p_id = await projectMemberServiceInstance.getProjectMemberIdByWorkspaceMemberId(id.id);
    await projectMemberServiceInstance.removeProjectMembers(p_id);
    const roleServiceInstance = Container.get(WorkspaceMemberRoleService);
    await roleServiceInstance.removeMemberRole(id.id);
    const workspaceMemberServiceInstance = Container.get(WorkspaceMemberService);
    const isRemoved = await workspaceMemberServiceInstance.removeMember(id);
    return isRemoved;
  } catch (e) {
    logger.error('🔥 error while removing Member: %o', e);
    return e;
  }
};

const getWorkSpaceMemberByWorkspaceIdAndUserId = async ({ workspace_id, user_id }) => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getWorkSpaceMemberByWorkspaceIdAndUserId with param: %o', { workspace_id, user_id });
  try {
    const workspaceMemberServiceInstance = Container.get(WorkspaceMemberService);
    const workSpaceMember = await workspaceMemberServiceInstance.getWorkSpaceMemberByWorkspaceIdAndUserId({
      workspace_id,
      user_id,
    });
    if (!workSpaceMember) {
      throw new Error('Record Not Found');
    }
    return workSpaceMember;
  } catch (e) {
    logger.error('🔥 error while getting workspace Member By WorkspaceId And UserId: %o', e);
    return e;
  }
};
const getWorkSpaceMember = async (opArgs): Promise<{ owner_id: number; Member: IWorkspaceMember[] }> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getWorkSpaceMember with param: %o', opArgs);
  try {
    const workspaceMemberServiceInstance = Container.get(WorkspaceMemberService);
    const workspaceMember = await workspaceMemberServiceInstance.getWorkspaceMember(opArgs);

    const workspaceServiceInstance = Container.get(WorkSpaceService);
    const { workspace } = await workspaceServiceInstance.getWorkSpaceMember(opArgs.where.workspace_id);

    workspaceMember.forEach(item => {
      if (item.WorkspaceMemberRole === null) {
        item.WorkspaceMemberRole = null;
      } else {
        const result = JSON.parse(JSON.stringify(item.WorkspaceMemberRole));
        item.WorkspaceMemberRole.role = result.role.split(',');
      }
    });
    workspaceMember.forEach(item => {
      workspace?.Member?.map(res => {
        if (res.id === item.user_id) {
          item.first_name = res.first_name;
          item.last_name = res.last_name;
        }
      });
    });
    return {
      owner_id: workspace.owner_id,
      Member: workspaceMember,
    };
  } catch (e) {
    logger.error('🔥 error while getting workspace Member: %o', e);
    return e;
  }
};

const WorkSpaceMemberInvitation = async (
  workspace_id,
  users
): Promise<{ owner_id: number; Member: IWorkspaceMember[] }> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling WorkSpaceMemberInvitation with param: %o', workspace_id, users);
  try {
    const UserServiceInstance = Container.get(UserService);
    const loginServiceInstance = Container.get(LoginService);

    const workspace = await workSpaceById(workspace_id);
    const owner = await UserServiceInstance.getUser(workspace.owner_id);

    await Promise.all(
      users.map(async user => {
        const User = await loginServiceInstance.Login({
          email: user.email,
        });

        const workspaceMemberServiceInstance = Container.get(WorkspaceMemberService);
        const isExist = await workspaceMemberServiceInstance.getWorkSpaceMemberByWorkspaceIdAndUserEmail({
          workspace_id,
          email: user.email,
        });
        if (!isExist) {
          await addWorkspaceMember({
            workspace_id,
            user_id: User.user !== null ? User.user.id : null,
            email: user.email,
            status: MEMBER_STATUS.pending,
            created_by: owner.user.id,
            updated_by: owner.user.id,
          });
        }

        const workspace_info = {
          id: workspace_id,
          owner_name: `${owner.user.first_name} ${owner.user.last_name}`,
          name: `${workspace.workspace_name}`,
        };
        let workspaceMember = {};
        if (User.user) {
          const body = {
            workspace_id: workspace_id,
            email: User.user.email,
          };
          workspaceMember = await workspaceMemberServiceInstance.getWorkSpaceMemberByWorkspaceIdAndUserEmail(body);
        }

        const template = User.user
          ? inviteMailTemplateRegisteredUsers(workspace_info, user, workspaceMember.id)
          : inviteMailTemplateForNewUsers(workspace_info, user);
        const params = {
          from: config.senderEmail,
          to: [template.email],
          Subject: {
            Charset: 'UTF-8',
            Data: template.subject,
          },
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: template.html,
            },
            Text: {
              Charset: 'UTF-8',
              Data: template.text,
            },
          },
        };
        await sendEmail(params);
      })
    );
    const opArgs = {
      limit: 10,
      offset: 0,
      where: { workspace_id: workspace_id },
      order: [['id', 'ASC']],
    };

    const workspaceMember = await getWorkSpaceMember(opArgs);
    return workspaceMember;
  } catch (e) {
    logger.error('🔥 error while inviting workspaceMember %o', e);
    return e;
  }
};

const getAllWorkspaceMember = async (body): Promise<{ id: number; email: string; user_id: number }[]> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getAllWorkspaceMember with body: %o', body);
  try {
    const workspaceMemberServiceInstance = Container.get(WorkspaceMemberService);
    const members = await workspaceMemberServiceInstance.getAllWorkspaceMember(body);
    const workspaceMembers = members.map(value => ({ id: value.id, email: value.email, user_id: value.user_id }));
    return workspaceMembers;
  } catch (error) {
    logger.error('🔥 error while getting all workspace members by workspace id: %o', error);
    return error;
  }
};
export {
  updateWorkSpace,
  workSpaceByOwnerId,
  workSpaceById,
  addWorkspaceMember,
  updateWorkspaceMember,
  removeMember,
  addWorkSpace,
  WorkSpaceMemberInvitation,
  getWorkSpaceMember,
  getWorkSpaceMemberByWorkspaceIdAndUserId,
  getAllWorkspaceMember,
};
