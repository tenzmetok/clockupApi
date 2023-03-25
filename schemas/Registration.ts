export const types = `

    input registerUserInput {
        first_name:String!
        last_name:String!
        email:String!
        password:String!
        token:String
    }

    type userRegistered{ 
        isUserRegistered: Boolean!
    }
`;

export const queries = `
`;

export const mutations = `
    registerUser(input : registerUserInput!) : userRegistered!
`;
