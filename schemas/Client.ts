export const types = `
    type Client {
        id: ID!
        name: String!
        color: String
        created_at: String
        archive_status: Boolean
        updated_at: String
        created_by: String
        updated_by:String
        Projects:[Project!]
    }

    type isClientAdded{
        isAdded:Boolean!
    }

    type isClientUpdated{
        isUpdated:Boolean!
    }

    type clientRemoved {
        isRemoved: Boolean!
    }
    
    type clientResponse {
        clients:[Client!]
        count: Int
    
    }

    input userWhereInput { 
        limit: Int
        offset: Int
        query : String
        workspace_id : ID
        archive_status : Boolean
    }

    input addClientInput {
        name: String!
        workspace_id:ID!
    }

    input updateClientInput {
        id: ID!
        workspace_id: ID!
        name: String
        archive_status: Boolean

    }

    enum orderEnum {
        ASC
        DESC
    }

    input clientOrderInput {
        key:String
        value:String
    }
`;

export const queries = `
    getClientsByWorkspaceId(workspace_id:ID!):[Client]

    getFilteredClients(
        order:[clientOrderInput]
        where:userWhereInput
        ):clientResponse!
`;

export const mutations = ` 
    addClient(input: addClientInput!): isClientAdded
    removeClient(id: ID!): clientRemoved
    updateClient(input: updateClientInput!): isClientUpdated
`;
