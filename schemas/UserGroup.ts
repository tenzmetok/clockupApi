export const types = `
    type userGroup {
        id: ID!
        group_name: String!
        group_members: [groupMember!]
    }

    type groupMember{
        id: ID!
        email: String!
    }
    
    type WorkspaceMembers{
        id: ID!
        email: String
    }

    type userGroupAdded {
        isUserGroupAdded: Boolean!
    }

    type userGroupUpdated {
        isUserGroupUpdated: Boolean!
    }

    type userGroupRemoved {
        isUserGroupRemoved : Boolean!
    }

    input addUserGroupInput {
        group_name: String!
        workspace_id : ID!
    }

    input updateUserGroupInput {
        id: ID!
        group_name: String!
        workspace_id: ID!
    }
`;

export const queries = `
    getGroupsByWorkspaceId(workspace_id:ID!): [userGroup]
`;

export const mutations = `
    addUserGroup(input: addUserGroupInput!): userGroupAdded
    updateUserGroup(input: updateUserGroupInput!): userGroupUpdated
    removeUserGroup(id: ID!): userGroupRemoved
`;
