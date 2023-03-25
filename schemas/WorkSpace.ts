export const types = `
type WorkSpace {
    id:ID!
    owner_id:ID!
    workspace_name: String
    company_logo:String
    timetracker_status: Boolean
    billing_status: String
    visibility_status: String
    bill_rate: Float 
    bill_rate_view_status: String
    currency: String
    group_project_label: String
    create_project_status: String
    create_client_status: String
    create_task_status: String
    task_filter: Boolean
    create_tag_status: String
    time_format: String
    favorite_status: Boolean
}

type Member{
    id:ID
    workspace_member_id:ID
    user_id: ID
    first_name:String
    last_name:String
    email:String
    status:String
    active_status: Boolean
    WorkspaceMemberRole: Workspace_member_role
}

type WorkspaceMember{
    owner_id:ID!
    Member:[Member!]
}

type workSpaceProfileUploadLink {
    signedRequest: String
    url: String
}

type memberRemoved {
    isRemoved: Boolean!
}

input MemberInvitation{
    id:ID
    email:String
}   

input updateWorkSpaceInput{
    id:ID!
    owner_id:ID!
    workspace_name: String!
    company_logo:String
    timetracker_status: Boolean
    billing_status: String
    visibility_status: String
    bill_rate: Float 
    bill_rate_view_status: String
    currency: String
    group_project_label: String
    create_project_status: String
    create_client_status: String
    create_task_status: String
    task_filter: Boolean
    create_tag_status: String
    time_format: String
    favorite_status: Boolean
}

type updateWorkspace{
    isUpdated:Boolean!
}

input addWorkSpaceInput{
    owner_id:ID!
    workspace_name: String
    company_logo:String
    timetracker_status: Boolean
    billing_status: String
    visibility_status: String
    bill_rate: String 
    bill_rate_view_status: String
    currency: String
    group_project_label: String
    create_project_status: String
    create_client_status: String
    create_task_status: String
    task_filter: Boolean
    create_tag_status: String
    time_format: String
    favorite_status: Boolean
}
input addWorkSpaceMemberInput{
    workspace_id:ID!
    user_id:ID!
    status: String!
}
 input userWhereMemberInput {
     limit: Int
    offset: Int
        query : String
        workspace_id : ID
        active_status: Boolean
        status: String
    }
input updateWorkSpaceMemberInput{
    id: ID!
    workspace_id: ID!
    user_id: ID
    email: String
    status: String
    active_status: Boolean
}

input WorkSpaceMemberInvitationInput{
    workspace_id:ID!
    users:[MemberInvitation] 
}
 input memberOrderInput {
        key:String
        value:String
    }
input getWorkSpacePicUploadLinkInput{
    fileName: String
    fileType: String
}
`;
export const queries = `
    workSpaceByOwnerId(owner_id: ID!): [WorkSpace]!
    workSpaceById(id:ID!):WorkSpace!
    getWorkSpaceMember(
    order:[memberOrderInput]
    where:userWhereMemberInput):WorkspaceMember!
    getAllWorkspaceMember(workspace_id:ID!):[Member]!
`;

export const mutations = ` 
    updateWorkSpace(input: updateWorkSpaceInput!): updateWorkspace!
    addWorkSpaceMember(input: addWorkSpaceMemberInput):WorkSpace!
    updateWorkSpaceMember(input: updateWorkSpaceMemberInput):WorkSpace!
    WorkSpaceMemberInvitation(input: WorkSpaceMemberInvitationInput!):WorkspaceMember!
    addWorkSpace(input: addWorkSpaceInput!): WorkSpace!
    getWorkSpacePicUploadLink(input: getWorkSpacePicUploadLinkInput!): workSpaceProfileUploadLink!
    removeMember(id: ID!): memberRemoved
`;
