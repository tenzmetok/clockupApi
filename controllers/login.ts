import { Container } from 'typedi';
import config from '../config';
import LoginService from '../services/login';
import ProjectMemberService from '../services/projectMember';
import ProjectMemberRoleService from '../services/projectMemberRole';
import WorkspaceMemberRoleService from '../services/workspaceMemberRole';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async body => {
  const logger: any = Container.get('logger');
  logger.debug('Calling login with body: %o', body);
  try {
    const LoginServiceInstance = Container.get(LoginService);
    const passwordCheck = body.password;
    delete body.password;
    const { user } = await LoginServiceInstance.Login(body);

    if (!user) {
      throw new Error('Email is not registered!');
    }

    if (user && !user.is_confirm) {
      throw new Error('Email is not verified yet!');
    }

    const match = await bcrypt.compare(passwordCheck, user.password);
    if (user.WorkspaceMember.length !== 0) {
      if (user.WorkspaceMember[0].WorkspaceMemberRole !== null) {
        const result = JSON.parse(JSON.stringify(user.WorkspaceMember[0].WorkspaceMemberRole.role));
        const role = result?.split(',');
        const projectMemberServiceInstance = Container.get(ProjectMemberService);
        const projectMemberIds = await projectMemberServiceInstance.getProjectMemberIdByWorkspaceMemberId(
          user.WorkspaceMember[0].id
        );
        const projectMemberRoleServiceInstance = Container.get(ProjectMemberRoleService);
        const members = await projectMemberRoleServiceInstance.getProjectMemberRoleByProjectIds(projectMemberIds);
        const managerIds = members.filter(item => item.role === 'Manager').map(item => item.id);
        const memberIds = members.filter(item => item.role === 'Member').map(item => item.id);
        const managerProjectIds = await (
          await projectMemberServiceInstance.getProjectMemberByManagerIds(managerIds)
        ).map(item => item.project_id);

        const memberProjectIds = await (
          await projectMemberServiceInstance.getProjectMemberByMemberIds(memberIds)
        ).map(item => item.project_id);

        user['memberIds'] = memberProjectIds;
        user['managerIds'] = managerProjectIds;
        user['role'] = role;
        user['workspaceMemberId'] = user.WorkspaceMember[0].id;
      } else {
        user['role'] = ['Owner'];
        if (user.WorkspaceMember[0].Workspace.owner_id === user.WorkspaceMember[0].user_id) {
          const body = {
            role: ['Owner'],
            workspace_member_id: user.WorkspaceMember[0].id,
            can_edit: false,
            can_delete: false,
            createdBy: user.WorkspaceMember[0].user_id,
            updatedBy: user.WorkspaceMember[0].user_id,
          };
          const roleServiceInstance = Container.get(WorkspaceMemberRoleService);
          roleServiceInstance.addRole(body);
        } else {
          user['role'] = ['WorkspaceMember'];
          const body = {
            role: ['WorkspaceMember'],
            workspace_member_id: user.WorkspaceMember[0].id,
            can_edit: false,
            can_delete: false,
            createdBy: user.WorkspaceMember[0].user_id,
            updatedBy: user.WorkspaceMember[0].user_id,
          };
          const roleServiceInstance = Container.get(WorkspaceMemberRoleService);
          roleServiceInstance.addRole(body);
        }
      }
    }
    if (match) {
      const payload = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        current_workspace: user.current_workspace,
      };
      LoginService;
      const accessToken = jwt.sign(payload, config.jwtSecret, {
        expiresIn: 60 * 60 * 12,
      });
      user['isAuthenticated'] = true;
      user['Workspaces'] = await user.WorkspaceMember.map(item => item.Workspace.dataValues);
      const response = {
        user: user,
        ok: true,
        token: accessToken,
      };

      return response;
    } else {
      return { ok: false };
    }
  } catch (error) {
    logger.error('🔥 error during verifying email %o', error.message);
    throw error;
  }
};

const getUser = async id => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getUser with param: %o', id);
  try {
    const LoginServiceInstance = Container.get(LoginService);
    const { user } = await LoginServiceInstance.getUser({ id });
    if (user.WorkspaceMember.length !== 0) {
      const result = JSON.parse(JSON.stringify(user.WorkspaceMember[0].WorkspaceMemberRole.role));
      const role = result?.split(',');

      const projectMemberServiceInstance = Container.get(ProjectMemberService);
      const projectMemberIds = await projectMemberServiceInstance.getProjectMemberIdByWorkspaceMemberId(
        user.WorkspaceMember[0].id
      );
      const projectMemberRoleServiceInstance = Container.get(ProjectMemberRoleService);
      const members = await projectMemberRoleServiceInstance.getProjectMemberRoleByProjectIds(projectMemberIds);
      const managerIds = members.filter(item => item.role === 'Manager').map(item => item.id);
      const memberIds = members.filter(item => item.role === 'Member').map(item => item.id);
      const managerProjectIds = await (
        await projectMemberServiceInstance.getProjectMemberByManagerIds(managerIds)
      ).map(item => item.project_id);

      const memberProjectIds = await (
        await projectMemberServiceInstance.getProjectMemberByMemberIds(memberIds)
      ).map(item => item.project_id);

      user['memberIds'] = memberProjectIds;
      user['managerIds'] = managerProjectIds;
      user['workspaceMemberId'] = user.WorkspaceMember[0].id;
      user['role'] = role;
    }

    if (!user) {
      throw new Error('Record Not Found');
    }
    user['Workspaces'] = await user.WorkspaceMember.map(item => item.Workspace.dataValues);

    return user;
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};
export { getUser, login };
