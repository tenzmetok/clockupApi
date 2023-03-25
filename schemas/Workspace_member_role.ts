export const types = `
    type Workspace_member_role {
        id: ID!
        workspace_member_id : ID
        can_edit: Boolean
        can_view: Boolean
        can_delete: Boolean
        role: [ROLE]
        created_at: String
        updated_at: String
        created_by: String
        updated_by: String
    }
  
    type projectMember {
    id: ID
    workspace_member_id: ID
    project_id: ID
    projectMemberRole: projectMemberRole
    }
    
    enum ROLE {
        Owner
        WorkspaceMember
        Admin
        ProjectManager
    }
     type isRoleUpdated {
        isUpdated: Boolean!
    }
    type isprojectAdded {
        isAdded: Boolean!
    }
    type isProjectRemoved{
        isRemoved: Boolean!
    }
    type isRoleRemoved {
        isRemoved: Boolean!
    }

     type isRoleAdded{
        isAdded: Boolean!
    }

    type roleResponse {
        getAllRoles:[Workspace_member_role!]
        count: Int
    }
  
   
 
    input projectDetails{
       id:ID
    }
    

    input userWhereRoleInput { 
        query : String
        workspace_member_id : ID
    }

    input addRoleInput {
        role: [ROLE]
        workspace_member_id : ID!
        can_edit: Boolean!
        can_delete: Boolean!
    }
    input removeProjectsInput {
        workspace_member_id: ID!
        project_id: [projectDetails]
    }

    input updateRoleInput {
        role: [ROLE]
        workspace_member_id : ID
        can_edit: Boolean!
        can_delete: Boolean!

    }
    input addprojectInput {
    id: ID
    project_id: [projectDetails]
    role: String
    created_by: String
    updated_by: String
    }
    
    input roleOrderInput {
        key:String
        value:String
    }
   

   
`;

export const queries = `
    getRoleById(workspace_member_id : ID): Workspace_member_role
    getAllRoles(
    limit: Int
    offset: Int
    order:[roleOrderInput]
    where:userWhereRoleInput
    ): roleResponse!
    getProjectMemberIdByWorkspaceMemberId(id:ID):[projectMember!]
`;

export const mutations = ` 
    addRole(input: addRoleInput): isRoleAdded
    updateRole(input: updateRoleInput): isRoleUpdated
    addproject(input: addprojectInput): isprojectAdded
    removeProjects(input: removeProjectsInput): isProjectRemoved
`;
