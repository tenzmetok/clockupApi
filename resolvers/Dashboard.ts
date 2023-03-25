import { getTopProjectAndItsActivity } from '../../controllers/dashboard';
export const resolvers = {
  Query: {
    getTopProjectAndItsActivity: async (_, { input: { startDate, endDate, workspace_id, limit, offset } }) => {
      const res = await getTopProjectAndItsActivity({ startDate, endDate, workspace_id, limit, offset });
      return res;
    },
  },
};
