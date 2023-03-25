import { addTag, tags, getTag, removeTag, updateTag } from '../../controllers/tag';
import { Op } from 'sequelize';
import sequelize from '../../loaders/sequelize';

export const resolvers = {
  Mutation: {
    addTag: async (_, { input: { tag_name, workspace_id } }, ctx) => {
      const body = {
        tag_name,
        workspace_id,
        created_by: ctx.user.id,
        updated_by: ctx.user.id,
      };
      const isTagAdded = await addTag(body);
      return { isTagAdded };
    },
    removeTag: async (_, { id }) => {
      const isRemoved = await removeTag({ id });
      return { isRemoved };
    },
    updateTag: async (_, { input: { id, tag_name, archive_status, workspace_id } }) => {
      const body = { id, tag_name, archive_status, workspace_id };
      const isUpdated = await updateTag(body);
      return { isUpdated };
    },
  },

  Query: {
    tag: async (_, { id }) => {
      const res = await getTag(id);
      return res;
    },
    tags: async (parent, args, ctx, info) => {
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
          where: { query: searchQuery, archive_status, workspace_id },
          limit,
          offset,
        } = args;
        let whereClause = {};
        if (searchQuery) {
          whereClause = {
            [Op.or]: [
              sequelize.Sequelize.where(sequelize.Sequelize.fn('LOWER', sequelize.Sequelize.col('Tag.tag_name')), {
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
      const res = await tags(opArgs);
      return res;
    },
  },
};
