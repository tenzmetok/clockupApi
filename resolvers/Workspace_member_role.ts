import {
  addRole,
  getRoleById,
  updateRole,
  addproject,
  removeProjects,
  getProjectMemberIdByWorkspaceMemberId,
} from '../../controllers/workspace_member_role';

export const resolvers = {
  Mutation: {
    addRole: async (_, { input: { role, workspace_member_id, can_edit, can_delete } }, ctx) => {
      const body = {
        role,
        workspace_member_id,
        can_edit,
        can_delete,
        created_by: ctx.user.id,
        updated_by: ctx.user.id,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const isAdded = await addRole(body);
      return { isAdded };
    },
    updateRole: async (_, { input: { role, workspace_member_id, can_edit, can_delete } }) => {
      const body = { role, workspace_member_id, can_edit, can_delete };
      const isUpdated = await updateRole(body);
      return { isUpdated };
    },
    addproject: async (_, { input: { id, project_id, role } }, ctx) => {
      const body = {
        id,
        project_id,
        role,
        created_by: ctx.user_id || 1,
        updated_by: ctx.user_id || 1,
      };
      const isAdded = await addproject(body);
      return { isAdded };
    },
    removeProjects: async (_, { input: { workspace_member_id, project_id } }) => {
      const isRemoved = await removeProjects(workspace_member_id, project_id);
      return { isRemoved };
    },
  },

  Query: {
    getRoleById: async (_, { workspace_member_id }) => {
      const res = await getRoleById(workspace_member_id);
      return res;
    },
    getProjectMemberIdByWorkspaceMemberId: async (_, { id }) => {
      const res = await getProjectMemberIdByWorkspaceMemberId(id);
      return res;
    },
  },
};
