export const types = `
input addUserGroupMemberInput {
    workspace_member_id : ID!
    group_id: ID!
    status: Boolean!
}
type userGroupMemberAdded {
    isGroupMemberAdded:Boolean
}

type groupMemberIds{
    id: ID!
}

type groupMembers{
    id: ID!
    email: String!
}

input removeGroupMemberInput {
    workspace_member_id : [String]!
    group_id: ID!
}

type groupMemberRemoved{
    isGroupMemberRemoved: Boolean!
}
`;

export const queries = `
    getGroupMembers(
    group_id: ID!
    workspace_id: ID!):[groupMembers]!
`;

export const mutations = `
    addUserGroupMember(input: [addUserGroupMemberInput]!): userGroupMemberAdded
    removeGroupMember(input: removeGroupMemberInput!): groupMemberRemoved
`;
