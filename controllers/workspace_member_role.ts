import { Container } from 'typedi';
import ProjectMemberService from '../services/projectMember';
import { updateProjectMemberRole, removeProjectMember } from './project';
import WorkspaceMemberRoleService from '../services/workspaceMemberRole';
import WorkspaceMemberService from '../services/workspaceMember';
import ProjectMemberRoleService from '../services/projectMemberRole';
import { IProjectMemberInput } from '../types/Project';

const addRole = async (body): Promise<boolean> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addRole with body: %o', body);
  try {
    const roleServiceInstance = Container.get(WorkspaceMemberRoleService);
    const isAdded = await roleServiceInstance.addRole(body);
    return isAdded;
  } catch (e) {
    logger.error('🔥 error while adding role: %o', e);
    return e;
  }
};

const getRoleById = async id => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getRoleById with param: %o', id);
  try {
    const roleServiceInstance = Container.get(WorkspaceMemberRoleService);

    const { role } = await roleServiceInstance.getRoleById(id);
    if (!role) {
      throw new Error('Record Not Found');
    }
    const result = JSON.parse(JSON.stringify(role));
    return { ...result, role: result.role.split(',') };
  } catch (e) {
    logger.error('🔥 error while getting roleById %o', e);
    return e;
  }
};
const addproject = async (body): Promise<boolean> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addproject with param: %o', body);
  try {
    const res = body.project_id?.map(async project => {
      const newBody = {
        workspace_member_id: body.id,
        project_id: project.id,
        role: body.role,
        created_by: body.created_by,
        updated_by: body.updated_by,
      };
      return updateProjectMemberRole(newBody);
    });
    if (res) return true;
    return false;
  } catch (e) {
    logger.error('🔥 error while adding project %o', e);
    return e;
  }
};
const removeProjects = async (workspace_member_id, project_id): Promise<boolean> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling removeProjects with param: %o', workspace_member_id, project_id);
  try {
    const res = project_id.map(async item => {
      const body = {
        workspace_member_id,
        project_id: item.id,
      };
      return removeProjectMember(body);
    });
    if (res) return true;
    return false;
  } catch (err) {
    logger.error('🔥 error while removing project %o', err);
    console.log(err);
  }
};

const updateRole = async (body): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug(`Calling updateRole with id ${body.id}: and body %o`, body);
  try {
    const role = 'Manager',
      can_edit = false,
      can_delete = false;

    const projectMemberServiceInstance = Container.get(ProjectMemberService);
    const project_member_id = await projectMemberServiceInstance.getProjectMemberIdByWorkspaceMemberId(
      body.workspace_member_id
    );

    if (body.role.find(item => item === 'ProjectManager') === undefined) {
      await projectMemberServiceInstance.removeProjectMembers(project_member_id);
    }

    const res = {
      workspace_member_id: body.workspace_member_id,
      role,
      can_delete,
      can_edit,
    };
    const projectMemberRoleServiceInstance = Container.get(ProjectMemberRoleService);
    await projectMemberRoleServiceInstance.updateProjectmemberById(res, project_member_id);
    const roleServiceInstance = Container.get(WorkspaceMemberRoleService);
    const isUpdated = await roleServiceInstance.updateRole(body);
    return isUpdated;
  } catch (e) {
    logger.error('🔥 error while updating role: %o', e);
    return e;
  }
};
const getProjectMemberIdByWorkspaceMemberId = async (id): Promise<IProjectMemberInput[]> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getProjectMemberIdByWorkspaceMemberId  with param: %o', id);
  try {
    const opArgs = {
      offset: 0,
      where: { workspace_id: id },
      order: [['id', 'ASC']],
    };
    const workspaceMemberServiceInstance = Container.get(WorkspaceMemberService);
    const workspaceMember = await workspaceMemberServiceInstance.getWorkspaceMember(opArgs);
    const projectMemberServiceInstance = Container.get(ProjectMemberService);
    const getProjectMembers = await projectMemberServiceInstance.getProjectMemberIdGroupByWorkspaceMemberId(
      workspaceMember
    );

    if (!getProjectMembers) {
      throw new Error('Record Not Found');
    }
    return getProjectMembers;
  } catch (e) {
    logger.error('🔥 error while getting all getProjectMemberIdByWorkspaceMemberId : %o', e);
    return e;
  }
};

export { addRole, getRoleById, updateRole, addproject, getProjectMemberIdByWorkspaceMemberId, removeProjects };
