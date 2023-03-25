export const types = `

type detailReportResponse{
    subtaskData: [DetailReport]
    count: Int
}
type DetailReport{
    id: ID
    user_id: ID
    project_id: ID
    task_id: ID
    discription: String
    is_billable: Boolean
    start_time: String
    end_time: String
    active_status: Boolean
    created_by: ID
    updated_by: ID
    created_at: String
    updated_at: String
    workspace_id: ID
    client_id: ID
    tag_id: ID
    subtask_date: String
    total_time: String
    is_running: Boolean
    client: Client
    project: Project
    user: User
    amount: Float
    subtasktag: [Tag]
}

input subTaskWhereInput {
    workspace_id: ID!
    limit: Int
    offset: Int
    client_id: Int
    project_id: Int
    visiblity_status: String
    startDate: String
    endDate: String
}

`;

export const queries = `
    getDetailsReport(where: subTaskWhereInput):detailReportResponse
`;

export const mutations = ` 

`;
