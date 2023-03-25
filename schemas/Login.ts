export const types = `
type LoginResponse {
    ok: Boolean!
    token: String
    user: User
}

input LoginInput {
    email:String!
    password:String!
   
}
type authCheckResponse {
    isAuthenticated: Boolean!
    user: User
}

`;

export const queries = `
    Login(
    email:String!
    password:String!
    ): LoginResponse!
    userByToken: authCheckResponse!
`;

export const mutations = ` 
    
`;
