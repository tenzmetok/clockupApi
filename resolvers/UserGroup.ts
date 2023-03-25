import { addUserGroup, getGroupsByWorkspaceId, removeUserGroup, updateUserGroup } from '../../controllers/userGroup';

export const resolvers = {
  Mutation: {
    addUserGroup: async (_, { input: { group_name, workspace_id } }, ctx) => {
      const body = {
        group_name,
        workspace_id,
        created_by: ctx.user.id,
        updated_by: ctx.user.id,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const isUserGroupAdded = await addUserGroup(body);
      return { isUserGroupAdded };
    },
    removeUserGroup: async (_, { id }) => {
      const isUserGroupRemoved = await removeUserGroup({ id });
      return { isUserGroupRemoved };
    },
    updateUserGroup: async (_, { input: { id, group_name, workspace_id } }, ctx) => {
      const body = {
        id,
        group_name,
        workspace_id,
      };

      const isUserGroupUpdated = await updateUserGroup(body);
      return { isUserGroupUpdated };
    },
  },

  Query: {
    getGroupsByWorkspaceId: async (_, workspace_id) => {
      const UserGroup = await getGroupsByWorkspaceId(workspace_id);
      return UserGroup;
    },
  },
};
