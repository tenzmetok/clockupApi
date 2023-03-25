export const types = `

type Project {
    id:ID!
    name: String!
    color: String!
    client_id: ID
    client: Client
    active_status:String
    visiblity_status:String
    created_at: String
    updated_at: String
    owner_id: ID
    bill_rate: Float
    billing_status: String
    estimation_type: String
    estimate_time: String
    highlighted:Boolean
    notes: String
    workspace:WorkSpace
    subtask:[subTask]
    Tasks:[Task!]
    workspaceProjectMembers:[workspaceProjectMembers]
    projectMembers:[projectMembers]
    projectGroup: [projectGroup]
}
type projectMembers{
    workspace_member_id:ID
    projectMemberRole:projectMemberRole
}
type workspaceProjectMembers {
    id:ID
    email: String
    user_id: ID
    created_at: String
    updated_at: String
    workspace_member_id: ID
    created_by: String
    updated_by: String
    WorkspaceMember:User
}
type projectGroup {
    id:ID
    UserGroupMember:[projectGroupMember]
    group_name: String
    created_at: String
    updated_at: String
    created_by: String
    updated_by: String
}

type projectGroupMember{
    id:ID
    email:String
    user_id: ID
}
type projectMemberRole{
    role: String
    project_member_id: ID
}
  
type projectDeleted {
    isDeleted: Boolean!
}

type isProjectAdded {
    isAdded: Boolean
}

type isProjectUpdated {
    isUpdated: Boolean!
}

type projectResponse {
    projects:[Project!]
    count: Int
}

input projectWhereInput {
    limit: Int
    offset: Int
    visiblity_status: String 
    query: String
    client_id: Int
    workspace_id: ID
    billing_status: String
}

input projectOrderInput {
    key: String
    value: String
}

input updateProjectInput {
    id:ID!
    name: String
    client_id: ID
    workspace_id: ID!
    color: String
    billing_status: String
    bill_rate: Float
    active_status: String
    visiblity_status: String
    notes: String
    estimation_type: String
    estimate_time: String
    highlighted: Boolean
}

input addProjectInput {
    name: String!
    client_id: ID!
    workspace_id: ID!
    visiblity_status: String
    color: String
    bill_rate: Float
    active_status: String
    created_by: String
    updated_by: String
}

input removeProjectMemberInput {
    workspace_member_id: ID
    project_id: ID
}

input removeProjectMemberGroupInput {
    group_id: ID
    project_id: ID
}

type addProjectMember {
    id: ID
    project_id: ID
    workspace_member_id: ID
}

type addProjectMemberResponse {
    projectMember:[addProjectMember]
}

type addProjectMemberGroupResponse {
    projectMemberGroup:[addProjectMemberGroup]
}

type addProjectMemberGroup {
    id: ID
    project_id: ID
    group_id: ID
}

input addProjectMemberInput {
    id: ID
    project_id: ID
    workspace_member_id: ID
    created_by: String
    updated_by: String
}

input addProjectMemberGroupInput {
    id: ID
    project_id: ID
    group_id: ID
    created_by: String
    updated_by: String
}

type isProjectMemberRoleUpdated {
    isUpdated: Boolean!
}

input updateProjectMemberRoleInput {
   workspace_member_id: ID
   project_id: ID
   can_edit: Boolean
   can_view: Boolean
   can_delete: Boolean
   role: String
}

type isProjectMemberRemoved {
    isRemoved: Boolean!
}

type isProjectMemberGroupRemoved {
    isRemoved: Boolean!
}`;

export const queries = `
getProjectById(id:ID):Project!
getProjectMatrixById(id:ID):Project!
getFilteredProjects(
    order:[projectOrderInput]
    where: projectWhereInput
    ):projectResponse!
getProjectMemberByProjectId(id:ID!):Project
getProjectMemberGroupByProjectId(id:ID!):Project
`;

export const mutations = ` 
    addProject(input: addProjectInput!): isProjectAdded!
    removeProject(id:ID!): projectDeleted
    updateProject(input: updateProjectInput): isProjectUpdated
    addProjectMember(input: [addProjectMemberInput]): addProjectMemberResponse
    removeProjectMember(input: removeProjectMemberInput): isProjectMemberRemoved!
    updateProjectMemberRole(input: updateProjectMemberRoleInput): isProjectMemberRoleUpdated
    addProjectMemberGroup(input: [addProjectMemberGroupInput]): addProjectMemberGroupResponse
    removeProjectMemberGroup(input: removeProjectMemberGroupInput): isProjectMemberGroupRemoved
`;
