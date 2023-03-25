import { addUserGroupMember, getGroupMembers, removeGroupMember } from '../../controllers/userGroupMember';

export const resolvers = {
  Mutation: {
    addUserGroupMember: async (_, { input: addUserGroupMemberInput }, ctx) => {
      const body = addUserGroupMemberInput.map(value => {
        value.created_by = ctx.user.id;
        value.updated_by = ctx.user.id;
        return value;
      });

      const isGroupMemberAdded = await addUserGroupMember(body);
      return { isGroupMemberAdded };
    },

    removeGroupMember: async (_, { input: { workspace_member_id, group_id } }) => {
      const isGroupMemberRemoved = await removeGroupMember({ workspace_member_id, group_id });
      return { isGroupMemberRemoved };
    },
  },

  Query: {
    getGroupMembers: async (_, { group_id, workspace_id }) => {
      const res = await getGroupMembers({ group_id, workspace_id });
      return res;
    },
  },
};
