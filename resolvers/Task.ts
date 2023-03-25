import { addTask, getFilteredTasks, getTask, removeTask } from '../../controllers/task';
import { Op } from 'sequelize';
import sequelize from '../../loaders/sequelize';
import { updateTask } from '../../controllers/task';

export const resolvers = {
  Mutation: {
    addTask: async (
      _,
      { input: { task_name, project_id, estimate_time, archive_status, active_status, updated_at } },
      ctx
    ) => {
      const body = {
        task_name,
        user_id: ctx.user.id || 1,
        project_id,
        estimate_time,
        archive_status,
        active_status,
        created_by: ctx.user.id || 1,
        updated_by: ctx.user.id || 1,
        created_at: new Date(),
        updated_at: updated_at || new Date(),
      };
      const isAdded = await addTask(body);
      return { isAdded };
    },
    removeTask: async (_, { id }) => {
      const isRemoved = await removeTask({ id });
      return { isRemoved };
    },
    updateTask: async (_, { input: { id, task_name, archive_status, project_id, highlighted, assignee_id } }) => {
      const body = { id, task_name, archive_status, project_id, highlighted, assignee_id };
      const isUpdated = await updateTask(body);
      return { isUpdated };
    },
  },

  Query: {
    task: async (_, { id }) => {
      const res = await getTask(id);
      return res;
    },

    getFilteredTasks: async (parent, args, ctx, info) => {
      const order = [];
      let opArgs = {};

      if (args && args.sortTask && args.sortTask.length > 0) {
        args.sortTask.forEach(element => {
          if (element.key && element.value) {
            order.push([element.key, element.value]);
          }
        });
      }

      const {
        where: { query: searchQuery, project_id, archive_status, limit, offset },
      } = args;
      let whereClause = {};
      if (searchQuery) {
        whereClause = {
          [Op.or]: [
            sequelize.Sequelize.where(sequelize.Sequelize.fn('LOWER', sequelize.Sequelize.col('Task.task_name')), {
              [Op.like]: `%${searchQuery.toLowerCase()}%`,
            }),
          ],
        };
      }

      if (project_id) {
        whereClause = { ...whereClause, project_id };
      }

      if (archive_status !== undefined) {
        whereClause = { ...whereClause, archive_status };
      }
      opArgs = {
        limit,
        offset,
        where: whereClause,
        order,
      };

      const { task, count } = await getFilteredTasks(opArgs);
      return { task, count };
    },
  },
};
