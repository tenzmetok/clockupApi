export const types = `
    type Tag {
        id: ID!
        tag_name: String!
        workspace_id : ID
        archive_status: Boolean
        created_at: String
        updated_at: String
        created_by: String
        updated_by: String
    }
     type isTagUpdated {
         isUpdated: Boolean!
    }

    type isTagRemoved {
        isRemoved: Boolean!
    }

    type tagResponse {
        tags:[Tag!]
        count: Int
    }

    input userWhereTagInput { 
        query : String
        workspace_id : ID
        archive_status : Boolean
    }

    input addTagInput {
        tag_name: String!
        workspace_id : ID!
    }

    input updateTagInput {
        id: ID!
        tag_name: String
        archive_status: Boolean
        workspace_id : ID
    }
    
    input tagOrderInput {
        key:String
        value:String
    }

    type tagAdded{
        isTagAdded: Boolean!
    }
`;

export const queries = `
    tag(id: ID!): Tag
    tags(
    limit: Int
    offset: Int
    order:[tagOrderInput]
    where:userWhereTagInput
    ): tagResponse!
`;

export const mutations = ` 
    addTag(input: addTagInput!): tagAdded
    removeTag(id: ID!): isTagRemoved
    updateTag(input: updateTagInput!): isTagUpdated
`;
