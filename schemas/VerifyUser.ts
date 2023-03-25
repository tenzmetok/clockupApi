export const types = `

    type userVerify{
        isUserVerified: Boolean!   
    }

    input verifyUserInput{
        id: ID!
    }
`;

export const queries = `
    
`;

export const mutations = `
    verifyUser(input: verifyUserInput): userVerify
`;
