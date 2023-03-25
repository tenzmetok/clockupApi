export const types = `
    type User{
        id:ID!
        first_name:String!
        last_name:String!
        email:String!
        isAuthenticated: Boolean
        current_workspace: ID
        Workspaces: [WorkSpace]
        user_logo:String
        role: [ROLE]
        memberIds: [ID]
        managerIds: [ID]
        workspaceMemberId:ID
    }
    
    input updateUserInput{
        id:ID!
        current_workspace: ID
        first_name: String
        last_name: String
        oldPassword: String
        password: String
        user_logo: String
        is_confirm: Boolean
    }

    type Regresponse{
        user:[User!]
        count:Int
    }

    type userUpdated{
        isUserUpdated: Boolean!   
    }

    type token{
        token:String
    }

    input addUserInput {
        first_name:String!
        last_name:String!
        email:String!
        password:String!
    }
    input getUserInput {
        email: String!
    }
    input RegOrderInput {
        key:String
        value:String
    }

    type userProfileUploadLink {
        signedRequest: String
        url: String
    }
    input getUserPicUploadLinkInput{
        fileName: String
        fileType: String
    }
`;

export const queries = `
    getUser(id: ID!):User!
    users(
    limit: Int
    offset: Int
    order:[RegOrderInput]
    where:userWhereInput
    ): Regresponse!
    getUsersExceptWorkspaceMember(ids:[ID!]):[User!]
`;

export const mutations = `
    updateUser(input: updateUserInput) : userUpdated
    getUserPicUploadLink(input: getUserPicUploadLinkInput!): userProfileUploadLink!
`;
