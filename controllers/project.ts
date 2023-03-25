import { Container } from 'typedi';
import WorkSpaceService from '../services/workspace';
import isEmpty from 'lodash/isEmpty';
import ProjectService from '../services/project';
import TaskService from '../services/task';
import ProjectMemberService from '../services/projectMember';
import ProjectMemberRoleService from '../services/projectMemberRole';
import { getWorkSpaceMemberByWorkspaceIdAndUserId } from './workspace';
import { IProjectInput, IProjectMemberGroupInput, IProjectMemberInput } from '../types/Project';
import ProjectMemberGroupService from '../services/projectMemberGroup';
import { ROLE } from '../utils/commonConstants';
import WorkspaceMemberRoleService from '../services/workspaceMemberRole';
import UserService from '../services/user';

const addProject = async body => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addProject with body: %o', body);
  try {
    const projectServiceInstance = Container.get(ProjectService);
    let project;
    if (body.billing_status) {
      project = await projectServiceInstance.addProject(body);
    } else {
      const workspacewServiceInstance = Container.get(WorkSpaceService);
      const { WorkSpace } = await workspacewServiceInstance.getWorkSpaceById({ id: body.workspace_id });
      if (isEmpty(WorkSpace)) {
        throw new Error();
      } else {
        project = await projectServiceInstance.addProject({
          ...body,
          billing_status: WorkSpace.billing_status,
        });
      }
    }
    const hasWorkspaceMember = await getWorkSpaceMemberByWorkspaceIdAndUserId({
      user_id: body.owner_id,
      workspace_id: body.workspace_id,
    });
    if (hasWorkspaceMember) {
      const projectMemberBody = [
        {
          workspace_member_id: hasWorkspaceMember.id,
          project_id: project.id,
          created_by: hasWorkspaceMember.created_by,
          updated_by: hasWorkspaceMember.updated_by,
        },
      ];
      await addProjectMember(projectMemberBody);
      await updateProjectMemberRole({
        workspace_member_id: hasWorkspaceMember.id,
        project_id: project.id,
        role: ROLE.Owner,
        created_by: hasWorkspaceMember.created_by,
        updated_by: hasWorkspaceMember.updated_by,
      });
    }
    return project ? true : false;
  } catch (e) {
    logger.error('🔥 error while adding project: %o', e);
    return e;
  }
};

const getProjectById = async id => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getProject with id: %o', id);
  try {
    const projectServiceInstance = Container.get(ProjectService);
    const { project } = await projectServiceInstance.getProjectById({ id });
    if (!project) {
      throw new Error('Record Not Found');
    }
    return project;
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};

const removeProject = async id => {
  const logger: any = Container.get('logger');
  logger.debug('Calling removeProject with param: %o', id);
  try {
    const projectServiceInstance = Container.get(ProjectService);
    const taskServiceInstance = Container.get(TaskService);
    const projectMemberServiceInstance = Container.get(ProjectMemberService);
    const ProjectMemberGroupServiceInstance = Container.get(ProjectMemberGroupService);
    await projectMemberServiceInstance.removeProjectMemberByProjectId(id);
    await ProjectMemberGroupServiceInstance.removeProjectMemberGroupById({ project_id: id });
    await taskServiceInstance.removeTaskByProjectId(id);
    const isDeleted = await projectServiceInstance.removeProject(id);
    return isDeleted;
  } catch (e) {
    logger.error('🔥 error while removing project: %o', e);
    return e;
  }
};

const getFilteredProjects = async opArgs => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getFilteredProjects with param: %o', opArgs);
  try {
    const projectServiceInstance = Container.get(ProjectService);
    const { projects, count } = await projectServiceInstance.getFilteredProjects(opArgs);
    if (!projects) {
      throw new Error('Record Not Found');
    }
    return { projects, count };
  } catch (e) {
    logger.error(':fire: error: %o', e);
    return e;
  }
};

const updateProject = async (body: IProjectInput) => {
  const logger: any = Container.get('logger');
  logger.debug(`Calling updateProject and body %o`, body);
  try {
    const projectServiceInstance = Container.get(ProjectService);
    const { projects: projectList } = await projectServiceInstance.getFilteredProjects({
      workspace_id: body.workspace_id,
    });
    const isDuplicateProject = projectList.find(
      project =>
        project.client_id === parseInt(body.client_id) && project.name === body.name && project.id !== parseInt(body.id)
    );
    if (isDuplicateProject) {
      return false;
    }
    const isUpdated = await projectServiceInstance.updateProject(body);
    return isUpdated;
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};

const getProjectMatrixById = async id => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getClient with param: %o', id);
  try {
    const projectServiceInstance = Container.get(ProjectService);
    const taskServiceInstance = Container.get(TaskService);
    const userServiceInstance = Container.get(UserService);
    const { project } = await projectServiceInstance.getProjectMatrixById({ id });
    const Tasks = await Promise.all(
      project.subtask.map(async data => {
        if (!data.task_id) {
          return { task: { task_name: 'Without task' } };
        }
        return await taskServiceInstance.getTask(data.task_id);
      })
    );
    const AssigneeName = await Promise.all(
      Tasks.map(async val => {
        const id = val.task.assignee_id;
        if (!id) {
          return 'Anonyms Assignee';
        }
        const assigneeName = await userServiceInstance.getUser({ id });
        return assigneeName.user.first_name + ' ' + assigneeName.user.last_name;
      })
    );
    project.subtask.map(async (data, index) => {
      data.task_name = Tasks[index].task.task_name;
      data.assignee_name = AssigneeName[index];
    });
    return project;
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return e;
  }
};

const addProjectMember = async (body): Promise<IProjectMemberInput[]> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addprojectMember with body: %o', body);
  try {
    const projectMemberServiceInstance = Container.get(ProjectMemberService);
    const projectMemberRoleServiceInstance = Container.get(ProjectMemberRoleService);
    const isAdded = await projectMemberServiceInstance.addProjectMember(body);
    await Promise.all(
      isAdded.map(async projectMember => {
        await projectMemberRoleServiceInstance.addProjectMemberRole({
          role: ROLE.Member,
          project_member_id: projectMember.id,
          created_by: projectMember.created_by,
          updated_by: projectMember.updated_by,
        });
      })
    );
    return isAdded;
  } catch (e) {
    logger.error('🔥 error while adding projectMember: %o', e);
    return e;
  }
};
const removeProjectMember = async (body): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling removeProjectMember with body: %o', body);
  let isDeleted = 0;
  try {
    const projectMemberServiceInstance = Container.get(ProjectMemberService);
    const projectMemberRoleServiceInstance = Container.get(ProjectMemberRoleService);
    const hasMember = await projectMemberServiceInstance.getProjectMemberByProjectIdAndWorkspaceMemberId(body);
    if (hasMember) {
      const isDeletedRole = await removeProjectMemberRole(hasMember.id);
      if (isDeletedRole) {
        isDeleted = await projectMemberServiceInstance.removeProjectMember(body);
      }
    }

    const WorkspaceId = await projectMemberServiceInstance.getProjectMemberIdByWorkspaceMemberId(
      hasMember.workspace_member_id
    );
    const allWorkspaceId = await WorkspaceId.map(item => item.id);

    const hasWorkspaceMember = await projectMemberRoleServiceInstance.getProjectMemberIdInProjectMember(allWorkspaceId);

    const roleServiceInstance = Container.get(WorkspaceMemberRoleService);
    const roles = await roleServiceInstance.getRoleById(hasMember.workspace_member_id);
    const rrr = roles.role.role.split(',');
    const workspace_member_id = hasMember.workspace_member_id;
    if (hasWorkspaceMember.length === 0) {
      const role = [];
      if (rrr[1] === 'Admin') {
        role[0] = 'WorkspaceMember';
        role[1] = 'Admin';
        const body = { role, workspace_member_id, can_edit: true, can_delete: true };
        const roleServiceInstance = Container.get(WorkspaceMemberRoleService);
        await roleServiceInstance.updateRole(body);
      } else {
        role[0] = 'WorkspaceMember';
        const body = { role, workspace_member_id, can_edit: false, can_delete: false };
        const roleServiceInstance = Container.get(WorkspaceMemberRoleService);
        await roleServiceInstance.updateRole(body);
      }
    }

    return isDeleted;
  } catch (e) {
    logger.error('🔥 error while removing projectMember: %o', e);
    return e;
  }
};

const getProjectMemberByProjectId = async (body): Promise<{ projectMembers: IProjectInput }> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getProjectMemberByProjectId with param: %o', body);
  try {
    const projectMemberServiceInstance = Container.get(ProjectMemberService);
    const projectMembers = await projectMemberServiceInstance.getProjectMemberByProjectId(body);
    if (!projectMembers) {
      throw new Error('Record Not Found');
    }
    return projectMembers;
  } catch (e) {
    logger.error('🔥error while getting projectMember: %o', e);
    return e;
  }
};

const getProjectMemberByProjectIdAndWorkspaceMemberId = async (body): Promise<IProjectMemberInput> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getProjectMemberByProjectIdAndWorkspaceMemberId with body: %o', body);
  try {
    const projectMemberServiceInstance = Container.get(ProjectMemberService);
    const projectMembers = await projectMemberServiceInstance.getProjectMemberByProjectIdAndWorkspaceMemberId(body);
    if (!projectMembers) {
      throw new Error('Record Not Found');
    }
    return projectMembers;
  } catch (e) {
    logger.error('🔥 error while getProjectMemberByProjectIdAndWorkspaceMemberId: %o', e);
    return e;
  }
};

const addProjectMemberRole = async (body): Promise<boolean> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addprojectMemberRole with param: %o', body);
  try {
    const projectMemberRoleServiceInstance = Container.get(ProjectMemberRoleService);
    const isAdded = await projectMemberRoleServiceInstance.addProjectMemberRole(body);

    return isAdded;
  } catch (e) {
    logger.error('🔥 error while adding ProjectMember role: %o', e);
    return e;
  }
};
const updateProjectMemberRole = async ({
  workspace_member_id,
  project_id,
  role,
  created_by,
  updated_by,
}): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug(`Calling updateProjectMemberole with  and body %o`);
  try {
    const projectMemberServiceInstance = Container.get(ProjectMemberService);
    const projectMemberRoleServiceInstance = Container.get(ProjectMemberRoleService);
    const hasMember = await projectMemberServiceInstance.getProjectMemberByProjectIdAndWorkspaceMemberId({
      workspace_member_id,
      project_id,
    });
    const roleServiceInstance = Container.get(WorkspaceMemberRoleService);
    const roles = await roleServiceInstance.getRoleById(workspace_member_id);
    const WorkspaceId = await projectMemberServiceInstance.getProjectMemberIdByWorkspaceMemberId(workspace_member_id);
    const allWorkspaceId = await WorkspaceId.map(item => item.id);

    const hasWorkspaceMember = await projectMemberRoleServiceInstance.getProjectMemberIdInProjectMember(allWorkspaceId);
    const rrr = roles.role.role.split(',');
    if (role === 'Manager') {
      const role = [];
      if (rrr[1] === 'Admin') {
        role[0] = 'WorkspaceMember';
        role[1] = 'Admin';
        role[2] = 'ProjectManager';
        const body = { role, workspace_member_id, can_edit: false, can_delete: false };
        const roleServiceInstance = Container.get(WorkspaceMemberRoleService);
        await roleServiceInstance.updateRole(body);
      } else {
        role[0] = 'WorkspaceMember';
        role[1] = 'ProjectManager';

        const body = { role, workspace_member_id, can_edit: false, can_delete: false };
        const roleServiceInstance = Container.get(WorkspaceMemberRoleService);
        await roleServiceInstance.updateRole(body);
      }
    }
    if (role === 'Member') {
      const role = [];
      if (hasWorkspaceMember.length === 1) {
        if (rrr[1] === 'Admin') {
          role[0] = 'WorkspaceMember';
          role[1] = 'Admin';
          const body = { role, workspace_member_id, can_edit: true, can_delete: true };
          const roleServiceInstance = Container.get(WorkspaceMemberRoleService);
          await roleServiceInstance.updateRole(body);
        } else {
          role[0] = 'WorkspaceMember';
          const body = { role, workspace_member_id, can_edit: false, can_delete: false };
          const roleServiceInstance = Container.get(WorkspaceMemberRoleService);
          await roleServiceInstance.updateRole(body);
        }
      }
    }
    if (hasMember) {
      const isUpdatedRole = await projectMemberRoleServiceInstance.updateProjectMemberRole(
        { role },
        { project_member_id: hasMember.id }
      );
      return isUpdatedRole;
    } else {
      const body = {
        workspace_member_id,
        project_id,
        role,
        created_by,
        updated_by,
      };

      const projectMemberServiceInstance = Container.get(ProjectMemberService);
      const res = await projectMemberServiceInstance.addSingleProjectMember(body);
      if (res) return 1;
      return 0;
    }
  } catch (e) {
    logger.error('🔥 error while updating ProjectMember role: %o', e);
    return e;
  }
};

const removeProjectMemberRole = async (id): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug(`Calling removeProjectMemberRole with id ${id}`);
  try {
    const projectMemberRoleServiceInstance = Container.get(ProjectMemberRoleService);
    const isRemoved = await projectMemberRoleServiceInstance.removeProjectMemberRole(id);
    return isRemoved;
  } catch (e) {
    logger.error('🔥 error while removing ProjectMember role: %o', e);
    return e;
  }
};
const addProjectMemberGroup = async (body): Promise<IProjectMemberGroupInput[]> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling addProjectMemberGroup with body: %o', body);
  try {
    const ProjectMemberGroupServiceInstance = Container.get(ProjectMemberGroupService);
    const isAdded = await ProjectMemberGroupServiceInstance.addProjectMemberGroup(body);
    return isAdded;
  } catch (e) {
    logger.error('🔥 error occured while adding projectMember group: %o', e);
    return e;
  }
};
const removeProjectMemberGroup = async ({ group_id, project_id }): Promise<number> => {
  const logger: any = Container.get('logger');
  logger.debug(`Calling removeProjectMemberGroup with body ${{ group_id, project_id }}`);
  try {
    const projectMemberGroupServiceInstance = Container.get(ProjectMemberGroupService);
    const isRemoved = await projectMemberGroupServiceInstance.removeProjectMemberGroupById({ group_id, project_id });
    return isRemoved;
  } catch (e) {
    logger.error('🔥 error while removing ProjectMember group: %o', e);
    return e;
  }
};
const getProjectMemberGroupByProjectId = async (body): Promise<{ projectMemberGroup: IProjectInput }> => {
  const logger: any = Container.get('logger');
  logger.debug('Calling getProjectMemberGroupByProjectId with param: %o', body);
  try {
    const projectMemberGroupServiceInstance = Container.get(ProjectMemberGroupService);
    const projectMemberGroup = await projectMemberGroupServiceInstance.getProjectMemberGroupByProjectId(body);
    if (!projectMemberGroup) {
      throw new Error('Record Not Found');
    }
    return projectMemberGroup;
  } catch (e) {
    logger.error('🔥 error while getting projectMemberGroup : %o', e);
    return e;
  }
};

export {
  addProject,
  getFilteredProjects,
  removeProject,
  getProjectById,
  updateProject,
  getProjectMatrixById,
  addProjectMember,
  removeProjectMember,
  getProjectMemberByProjectId,
  addProjectMemberRole,
  updateProjectMemberRole,
  removeProjectMemberRole,
  getProjectMemberByProjectIdAndWorkspaceMemberId,
  addProjectMemberGroup,
  removeProjectMemberGroup,
  getProjectMemberGroupByProjectId,
};
