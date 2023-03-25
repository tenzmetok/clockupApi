export const types = `
    type Task {
        id: ID!
        task_name: String!
        user_id: ID
        project_id: ID
        start_time: String
        end_time: String
        estimate_time: String
        archive_status: Boolean
        active_status: Boolean
        created_at: String
        updated_at: String
        highlighted:Boolean
        assignee_id: ID
        project: Project
    }

    type isTaskAdded {
        isAdded:Boolean!   
    }

    type taskResponse {
        task:[Task!]
        count: Int
    }

    input addTaskInput {
        task_name: String
        user_id: ID
        project_id: ID
        start_time: String
        end_time: String
        estimate_time: String
        archive_status: Boolean
        active_status: Boolean
    }

    input updateTaskInput {
        id: ID!
        task_name: String
        archive_status: Boolean
        project_id:ID
        assignee_id:ID
        highlighted:Boolean
    }

    input taskInput{
        limit: Int
        offset: Int
        project_id: ID
        query : String
        archive_status : Boolean
    }

    input taskOrderInput {
        key: String
        value: String
    }

    type isTaskUpdated{
        isUpdated: Boolean!
    }

    type isTaskRemoved {
        isRemoved: Boolean!
    }

    enum order {
        ASC
        DESC
    } 
`;

export const queries = `
    task(id: ID!): Task

    getFilteredTasks(
        sortTask:[taskOrderInput]
        where:taskInput
        ):taskResponse!
    
   
`;

export const mutations = ` 
    addTask(input: addTaskInput): isTaskAdded
    removeTask(id: ID!):isTaskRemoved
    updateTask(input: updateTaskInput!): isTaskUpdated
`;
