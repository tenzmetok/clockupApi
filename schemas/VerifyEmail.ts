export const types = `

    type emailVerify{
        isEmailVerified: Boolean!   
    }

    input verifyEmailInput{
        token: String!
    }
`;

export const queries = `
    
`;

export const mutations = `
    verifyEmail(input: verifyEmailInput): emailVerify
`;
