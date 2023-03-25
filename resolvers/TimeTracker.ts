import {
  addSubTask,
  addSubTaskTags,
  updateSubTaskList,
  updateSubTaskTagsOfList,
  getTimeTrackerTasks,
  getSubTasks,
  removeSubTask,
  updateSubTask,
  getRunningSubTask,
  removeSubTaskTags,
} from '../../controllers/timeTracker';

export const resolvers = {
  Mutation: {
    addSubTask: async (
      _,
      {
        input: {
          workspace_id,
          discription,
          client_id,
          project_id,
          task_id,
          tag_id,
          is_billable,
          is_running,
          start_time,
          end_time,
          total_time,
          subtask_date,
        },
      },
      ctx
    ) => {
      const body = {
        user_id: ctx.user.id,
        workspace_id,
        discription,
        client_id,
        project_id,
        task_id,
        tag_id,
        is_billable,
        is_running,
        start_time,
        end_time,
        total_time,
        subtask_date,
        created_by: ctx.user.id || 1,
        updated_by: ctx.user.id || 1,
      };
      const subTaskData = await addSubTask(body);
      return subTaskData;
    },
    updateSubTask: async (
      _,
      {
        input: {
          workspace_id,
          discription,
          client_id,
          project_id,
          task_id,
          tag_id,
          is_billable,
          is_running,
          end_time,
          subtask_date,
          total_time,
        },
      },
      ctx
    ) => {
      const body = {
        user_id: ctx.user.id,
        workspace_id,
        discription,
        client_id,
        project_id,
        task_id,
        tag_id,
        is_billable,
        is_running,
        end_time,
        subtask_date,
        total_time,
        created_by: ctx.user.id || 1,
        updated_by: ctx.user.id || 1,
      };
      const isUpdated = await updateSubTask(body);
      return { isUpdated };
    },
    removeSubTask: async (_, { input }) => {
      const body = input.map(inputOfRemoveSubTasks => ({ ...inputOfRemoveSubTasks }));
      const isRemoved = await removeSubTask(body);
      return { isRemoved };
    },
    removeSubTaskTags: async (_, { input }) => {
      const body = input?.map(inputOfRemoveSubTasksTags => ({ ...inputOfRemoveSubTasksTags }));
      const isRemoved = await removeSubTaskTags(body);
      return { isRemoved };
    },
    updateSubTaskList: async (
      _,
      { input: { subTasksId, is_billable, subtask_date, discription, client_id, project_id, task_id, start_time } },
      ctx
    ) => {
      const subTaskId = subTasksId.map(inputOfSubTasksId => ({ ...inputOfSubTasksId }));
      const body = {
        is_billable,
        subtask_date,
        discription,
        client_id: client_id,
        project_id: project_id,
        task_id: task_id,
        start_time,
      };
      const isUpdated = await updateSubTaskList(body, subTaskId);
      return { isUpdated };
    },
    updateSubTaskTagsOfList: async (_, { input: { subTasksId, tagsId } }, ctx) => {
      let subTaskTags = [];
      const subTaskId = subTasksId.map(inputOfSubTasksId => ({ ...inputOfSubTasksId }));
      subTaskId.map(inputOfSubTaskId => {
        return tagsId.map(inputofSubTaskTagsId => {
          subTaskTags = [
            ...subTaskTags,
            {
              sub_task_id: inputOfSubTaskId.sub_task_id,
              tag_id: inputofSubTaskTagsId.tag_id,
              created_by: ctx.user.id || 1,
              updated_by: ctx.user.id || 1,
            },
          ];
          return subTaskTags;
        });
      });

      const updatedSubTaskTagsData = await updateSubTaskTagsOfList(subTaskTags, subTaskId);
      return { updatedSubTaskTagsData };
    },
    addSubTaskTags: async (_, { input }, ctx) => {
      const body = input.map(inputOfAddTag => ({
        ...inputOfAddTag,
        created_by: ctx.user.id || 1,
        updated_by: ctx.user.id || 1,
      }));
      const subTaskTagsData = await addSubTaskTags(body);
      return { subTaskTagsData };
    },
  },
  Query: {
    getTimeTrackerTasks: async (parent, args, ctx, info) => {
      let opArgs = {};
      const { workspace_id } = args;
      opArgs = { workspace_id };
      const { timeTrackerTasks, count } = await getTimeTrackerTasks(opArgs);
      return { timeTrackerTasks, count };
    },
    getSubTasks: async (parent, args, ctx, info) => {
      const {
        where: { workspace_id, weekStartDate, weekEndDate },
      } = args;
      const opArgs = {
        workspace_id,
        weekStartDate,
        weekEndDate,
      };
      const { subTasksData, count } = await getSubTasks(opArgs);
      return { subTasksData, count };
    },
    getRunningSubTask: async (_, { workspace_id }, ctx) => {
      const body = {
        user_id: ctx.user.id,
        workspace_id,
      };
      const { runningSubTask } = await getRunningSubTask(body);
      return { runningSubTask };
    },
  },
};
