export const types = `

type subTask{
    id:ID
    workspace_id:ID
    discription: String
    client_id:String
    project_id: ID
    task_id:ID
    tag_id:ID
    start_time:String
    end_time:String
    total_time:String
    task_name: String
    assignee_name: String
    subtask_date:String
    is_billable:Boolean
    is_running:Boolean
    task:Task
    project:Project
    client:Client
    subtasktag:[Tag]
    subtask_bill_rate: Int
}
type subTaskTagsData{
    id:ID
    workspace_id:ID
    sub_task_id:String
    tag_id:String
    tag_name:String
    created_by:String
    updated_by:String
    createdAt:String
    updatedAt:String
}
type addSubTaskTagsResponse{
    subTaskTagsData:[subTaskTagsData]
}
type timeTrackerTasks{
    id:ID
    name:String
    project:[Project]
}
type getTimeTrackerTasksResponse{
    timeTrackerTasks:[timeTrackerTasks]
    count:Int
}
type getSubTasksResponse{
    subTasksData:[subTask]
    count:Int
}
type isSubTaskUpdated{
    isUpdated:Boolean!
}
type isSubTaskRemoved {
    isRemoved: Boolean!
}
type getRunningSubTaskResponse{
    runningSubTask:subTask
}
type subTasksDate{
    subtask_date:String
}
type subTasksCount{
    subtask_date:String
    discription:String
    is_billable:Boolean
    total_count:String
    client_id:String
    project_id:String
    task_id:String
    tag_id:String
}
type updatedSubTaskTagsData{
    id:ID
    sub_task_id:String
    tag_id:String
}
type updatedSubTaskTagsResponse{
    updatedSubTaskTagsData:[updatedSubTaskTagsData]
}
input timeTrackerTasksWhereInput{
    workspace_id:ID
}
input addSubTaskInput{
    workspace_id:ID
    discription: String
    client_id:String
    project_id: ID
    task_id:ID
    tag_id:ID
    is_billable:Boolean
    start_time:String
    end_time:String
    total_time:String
    subtask_date:String
    is_running:Boolean
}
input updateSubTaskInput{
    workspace_id:ID
    discription: String
    client_id:String
    project_id: ID
    task_id:ID
    tag_id:ID
    is_billable:Boolean
    start_time:String
    end_time:String
    total_time:String
    subtask_date:String
    is_running:Boolean
}
input updateSubTasksId{
    id:ID
}
input updateSubTaskTagsId{
    sub_task_id:ID
    tag_id:ID
}
input updateSubTaskTagsInput{
    subTasksId:[updateSubTaskTagsId]
    tagsId:[updateSubTaskTagsId]
}
input updateSubTaskListInput{
    subTasksId:[updateSubTasksId]
    is_billable:Boolean
    subtask_date:String
    discription:String
    client_id:String
    project_id:String
    task_id:String
    start_time:String
}
input userWhereSubTasksInput{
    workspace_id:ID
    weekStartDate:String
    weekEndDate:String
}
input addTagsInput{
    id:ID
    sub_task_id:String
    tag_id:String
    tag_name:String
    created_by:String
    updated_by:String
}
input removeSubTasksInput{
    id:ID
}
input removeSubTasksTagsInput{
    sub_task_id:ID
}
`;
export const queries = `
    getTimeTrackerTasks(workspace_id:ID):getTimeTrackerTasksResponse
    getSubTasks(where:userWhereSubTasksInput):getSubTasksResponse
    getRunningSubTask(workspace_id:ID):getRunningSubTaskResponse
`;
export const mutations = `
    addSubTask(input: addSubTaskInput):subTask
    addSubTaskTags(input:[addTagsInput]):addSubTaskTagsResponse
    updateSubTask(input:updateSubTaskInput):isSubTaskUpdated
    updateSubTaskList(input: updateSubTaskListInput): isSubTaskUpdated
    updateSubTaskTagsOfList(input:updateSubTaskTagsInput):updatedSubTaskTagsResponse
    removeSubTask(input:[removeSubTasksInput]): isSubTaskRemoved
    removeSubTaskTags(input:[removeSubTasksTagsInput]):isSubTaskRemoved
`;
