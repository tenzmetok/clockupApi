import {
  addClient,
  removeClient,
  updateClient,
  getClientsByWorkspaceId,
  getFilteredClients,
} from '../../controllers/client';
import { Op } from 'sequelize';
import sequelize from '../../loaders/sequelize';

export const resolvers = {
  Mutation: {
    addClient: async (_, { input: { name, workspace_id } }, ctx) => {
      const body = { name, workspace_id, created_by: ctx.user.id || 1, updated_by: ctx.user.id || 1 };
      const isAdded = await addClient(body);
      return { isAdded };
    },
    removeClient: async (_, { id }) => {
      const isRemoved = await removeClient({ id });
      return { isRemoved };
    },
    updateClient: async (_, { input: { id, name, workspace_id, archive_status } }, ctx) => {
      const body = {
        id,
        name,
        workspace_id,
        archive_status,
        updated_by: ctx.user.id || 1,
      };
      const isUpdated = await updateClient(body);
      return { isUpdated };
    },
  },

  Query: {
    getClientsByWorkspaceId: async (_, { workspace_id }) => {
      const res = await getClientsByWorkspaceId(workspace_id);
      return JSON.parse(JSON.stringify(res));
    },

    getFilteredClients: async (parent, args, ctx, info) => {
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
          where: { query: searchQuery, archive_status, workspace_id, limit, offset },
        } = args;
        let whereClause = {};
        if (searchQuery) {
          whereClause = {
            [Op.or]: [
              sequelize.Sequelize.where(sequelize.Sequelize.fn('LOWER', sequelize.Sequelize.col('Client.name')), {
                [Op.like]: `%${searchQuery.toLowerCase()}%`,
              }),
            ],
          };
        }
        if (workspace_id) {
          whereClause = { ...whereClause, workspace_id };
        }
        if (archive_status === true || archive_status === false) {
          whereClause = { ...whereClause, archive_status };
        }
        opArgs = {
          limit,
          offset,
          where: whereClause,
          order,
        };
      }
      const { clients, count } = await getFilteredClients(opArgs);
      return { clients, count };
    },
  },
};
