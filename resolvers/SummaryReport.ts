import { getSummaryReport } from '../../controllers/summaryReport';

export const resolvers = {
  Query: {
    getSummaryReport: async (parent, args, ctx, info) => {
      let opArgs = {};
      const {
        where: { workspace_id, offset, client_id, visiblity_status, project_id, startDate, endDate, limit },
      } = args;

      let whereClause = {};

      whereClause = { ...whereClause, workspace_id };

      if (startDate && endDate) {
        whereClause = { ...whereClause, startDate, endDate };
      }

      if (project_id) {
        whereClause = { ...whereClause, project_id };
      }

      if (visiblity_status) {
        whereClause = { ...whereClause, visiblity_status };
      }

      if (client_id) {
        whereClause = { ...whereClause, client_id };
      }

      opArgs = {
        limit,
        offset,
        where: whereClause,
        order: [['updated_at', 'DESC']],
      };
      const { summaryReportData, count, latestProjectDetails } = await getSummaryReport(opArgs);
      return { summaryReportData, count, latestProjectDetails };
    },
  },
};
