export const types = `

    input duration{
        startDate:String
        endDate:String
        workspace_id:ID!
        limit:Int
        offset:Int
    }

    type topProject{
        project_name:String
        total_billable_hours:time
        total_time:time
        client_name:String
        project_activities:projectActivity
    }

    type time{
        hours: Int!
        minutes: Int!
        seconds: Int!
    }

    type projectActivity {
        projectSubtasks: [projectSubtask]
        count: Int
    }

    type projectSubtask{
        id: ID
        total_time: String
        subtask_date: String
        task: Task
        user: teamMember!
        discription: String
        subtasktag: [subTaskTag]
    }

    type subTaskTag{
        id: ID
        tag_name: String 
    }

    type teamMember {
        id: ID!
        first_name: String!
        last_name: String!
    }

`;
export const queries = `
    getTopProjectAndItsActivity(input: duration):topProject`;

export const mutations = `
    
`;
