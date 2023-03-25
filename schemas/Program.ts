export const types = `
    type Program {
        id: ID!
        client_id: ID
        name: String!
        description:String!
        ticketing_partner:String!
        hospitality_partner:String!
        merchandise_partner:String!
        internal_notes:String!
        created_at: String!
        updated_at: String!
    }

    type ProgramID {
        id: Int
    }

    type programResponse {
        programs:[Program!]
        count: Int
    }

    input programWhereInput { 
        id:ID,
        client_id: ID
        name: String!
        description:String!
        ticketing_partner:String!
        hospitality_partner:String!
        merchandise_partner:String!
        internal_notes:String!
    }

    input addProgramInput {
        client_id: ID
        name: String!
        description:String!
        ticketing_partner:String!
        hospitality_partner:String!
        merchandise_partner:String!
        internal_notes:String!
    }

    input updateProgramInput {
        id: Int!
        client_id: ID
        name: String!
        description:String!
        ticketing_partner:String!
        hospitality_partner:String!
        merchandise_partner:String!
        internal_notes:String!
    }
    
    input programOrderInput {
        key:String
        value:String
    }
`;

export const queries = `
    program(id: ID!): Program
    programs(
    limit: Int
    offset: Int
    order:[programOrderInput]
    where:programWhereInput
    ): programResponse!
`;

export const mutations = ` 
    addProgram(input: addProgramInput!): Program!
    removeProgram(id: Int!): ProgramID
    updateProgram(input: updateProgramInput!): Program!
`;
