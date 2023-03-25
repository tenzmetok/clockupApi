import { addAlert, getAllAlerts, getAlert, removeAlert, updateAlert } from '../../controllers/alert';
import { Op } from 'sequelize';
import sequelize from '../../loaders/sequelize';

export const resolvers = {
  Mutation: {
    addAlert: async (_, { input: { alert_name, name, details, workspace_id } }, ctx) => {
      const body = {
        alert_name,
        name,
        details,
        workspace_id,
        created_by: ctx.user.id,
        updated_by: ctx.user.id,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const isAlertAdded = await addAlert(body);
      return { isAlertAdded };
    },
    removeAlert: async (_, { id }) => {
      const isRemoved = await removeAlert({ id });
      return { isRemoved };
    },
    updateAlert: async (_, { input: { id, alert_name, name, details, workspace_id } }) => {
      const body = { id, alert_name, name, details, workspace_id };
      const isUpdated = await updateAlert(body);
      return { isUpdated };
    },
  },

  Query: {
    alert: async (_, { id }) => {
      const res = await getAlert(id);
      return res;
    },
    getAllAlerts: async (parent, args, ctx, info) => {
      const order = [];
      let opArgs = {};
      if (args) {
        if (args.order && args.order.length > 0) {
          args.order.forEach(element => {
            if (element.key && element.value) {
              order.push([element.key, element.value]);
            }
          });
        }
        const {
          where: { query: searchQuery, workspace_id },
          limit,
          offset,
        } = args;
        let whereClause = {};
        if (searchQuery) {
          whereClause = {
            [Op.or]: [
              sequelize.Sequelize.where(sequelize.Sequelize.fn('LOWER', sequelize.Sequelize.col('Alert.name')), {
                [Op.like]: `%${searchQuery.toLowerCase()}%`,
              }),
            ],
          };
        }
        if (workspace_id) {
          whereClause = { ...whereClause, workspace_id };
        }
        opArgs = {
          limit,
          offset,
          where: whereClause,
          order,
        };
      }
      const res = await getAllAlerts(opArgs);
      return res;
    },
  },
};
