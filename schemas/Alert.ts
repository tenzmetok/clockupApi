export const types = `
    type Alert {
        id: ID!
        alert_name: String!
        name: String!
        details: String!
        workspace_id : ID
        created_at: String
        updated_at: String
        created_by: String
        updated_by: String
    }
     
    type isAlertAdded{
        isAlertAdded: Boolean!
    }
     type isAlertUpdated {
         isUpdated: Boolean!
    }

    type isAlertRemoved {
        isRemoved: Boolean!
    }

    type alertResponse {
        getAllAlerts:[Alert!]
        count: Int
    }

    input userWhereAlertInput { 
        query : String
        workspace_id : ID
    }

    input addAlertInput {
        alert_name: String!
        name: String!
        details: String!
        workspace_id : ID!
    }

    input updateAlertInput {
        id: ID!
        alert_name: String
        name: String
        details: String
        workspace_id : ID
    }
    
    input alertOrderInput {
        key:String
        value:String
    }

`;

export const queries = `
    alert(id: ID!): Alert
    getAllAlerts(
    limit: Int
    offset: Int
    order:[alertOrderInput]
    where:userWhereAlertInput
    ): alertResponse!
`;

export const mutations = ` 
    addAlert(input: addAlertInput!): isAlertAdded
    removeAlert(id: ID!): isAlertRemoved
    updateAlert(input: updateAlertInput!): isAlertUpdated
`;
