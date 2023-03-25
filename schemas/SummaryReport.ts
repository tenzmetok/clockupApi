export const types = `
type SummaryReport{
    id: ID
    discription: String
    is_billable: Boolean
    start_time: String
    end_time: String
    created_by: ID
    updated_by: ID
    created_at: String
    updated_at: String
    workspace_id: ID
    subtask_date: String
    total_time: String
    amount: Float
    subtasktag: [Tag]
    task: Task
}
type LatestProjectDetails{
    project_name: String
    workspace_name: String
    latestTotalTime: String
    latestAmount: String
    is_billable: Boolean

}
type summaryReportResponse{
    summaryReportData: [SummaryReport]
    count:Int
    latestProjectDetails: LatestProjectDetails
}

input subtaskWhereInput {
    workspace_id: ID!
    limit: Int
    offset: Int
    client_id: Int
    project_id: Int
    time: String
    visiblity_status: String
    startDate: String
    endDate: String
}
`;
export const queries = `
getSummaryReport(where: subtaskWhereInput):summaryReportResponse

`;
export const mutations = `
`;
