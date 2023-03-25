export const types = `
    type EmailExistResponse {
        isEmailexist: Boolean!
    }
    
    input changePasswordInput {
        token:String!
        password:String!
    }

    type passwordChanged{ 
        isPasswordChanged: Boolean!
    }

    type verifiedUser{
        isVerified: Boolean!
    }
`;

export const queries = `
    EmailExist(email:String!): EmailExistResponse!
`;

export const mutations = ` 
    changePassword(input : changePasswordInput!) : passwordChanged
    verifyToken(token: String!): verifiedUser
`;
