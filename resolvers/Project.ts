import { Op } from 'sequelize';
import {
  addProject,
  removeProject,
  getProjectById,
  getFilteredProjects,
  updateProject,
  getProjectMatrixById,
  addProjectMember,
  removeProjectMember,
  getProjectMemberByProjectId,
  updateProjectMemberRole,
  addProjectMemberGroup,
  removeProjectMemberGroup,
  getProjectMemberGroupByProjectId,
} from '../../controllers/project';
import sequelize from '../../loaders/sequelize';

export const resolvers = {
  Mutation: {
    addProject: async (_, { input: { name, client_id, workspace_id, visiblity_status, color } }, ctx) => {
      const body = {
        name,
        client_id,
        workspace_id,
        visiblity_status,
        color,
        owner_id: ctx.user.id || 1,
        created_by: ctx.user.id || 1,
        updated_by: ctx.user.id || 1,
      };
      const isAdded = await addProject(body);
      return { isAdded };
    },

    updateProject: async (
      _,
      {
        input: {
          id,
          name,
          client_id,
          workspace_id,
          color,
          billing_status,
          bill_rate,
          notes,
          estimation_type,
          visiblity_status,
          estimate_time,
          highlighted,
          active_status,
        },
      },
      ctx
    ) => {
      const body = {
        id,
        name,
        client_id,
        workspace_id,
        color,
        billing_status,
        bill_rate,
        notes,
        visiblity_status,
        estimation_type,
        estimate_time,
        highlighted,
        created_by: ctx.user.id || 1,
        updated_by: ctx.user.id || 1,
        active_status,
      };
      const isUpdated = await updateProject(body);
      return { isUpdated };
    },
    removeProject: async (_, { id }) => {
      const isDeleted = await removeProject(id);
      return { isDeleted };
    },

    addProjectMember: async (_, { input }, ctx) => {
      const body = input.map(inputOfProjectMembers => ({
        ...inputOfProjectMembers,
        created_by: ctx.user.id || 1,
        updated_by: ctx.user.id || 1,
      }));
      const projectMember = await addProjectMember(body);
      return { projectMember };
    },
    removeProjectMember: async (_, { input: { workspace_member_id, project_id } }) => {
      const body = { workspace_member_id, project_id };
      const isRemoved = await removeProjectMember(body);
      return { isRemoved };
    },
    updateProjectMemberRole: async (_, { input: { project_id, workspace_member_id, role } }, ctx) => {
      const body = {
        project_id,
        role,
        workspace_member_id,
        created_by: ctx.user.id || 1,
        updated_by: ctx.user.id || 1,
      };
      const isUpdated = await updateProjectMemberRole(body);
      return { isUpdated };
    },
    addProjectMemberGroup: async (_, { input }, ctx) => {
      const body = input.map(inputOfProjectMemberGroup => ({
        ...inputOfProjectMemberGroup,
        created_by: ctx.user.id || 1,
        updated_by: ctx.user.id || 1,
      }));
      const projectMemberGroup = await addProjectMemberGroup(body);
      return { projectMemberGroup };
    },
    removeProjectMemberGroup: async (_, { input: { group_id, project_id } }) => {
      const body = { group_id, project_id };
      const isRemoved = await removeProjectMemberGroup(body);
      return { isRemoved };
    },
  },
  Query: {
    getProjectById: async (_, { id }) => {
      const res = await getProjectById(id);

      return res;
    },
    getFilteredProjects: async (parent, args, ctx, info) => {
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
          where: {
            query: searchQuery,
            archive_status,
            workspace_id,
            limit,
            offset,
            visiblity_status,
            billing_status,
            client_id,
          },
        } = args;
        let whereClause = {};
        if (searchQuery) {
          whereClause = {
            [Op.or]: [
              sequelize.Sequelize.where(sequelize.Sequelize.fn('LOWER', sequelize.Sequelize.col('Project.name')), {
                [Op.like]: `%${searchQuery.toLowerCase()}%`,
              }),
            ],
          };
        }
        if (workspace_id) {
          whereClause = { ...whereClause, workspace_id };
        }
        if (archive_status) {
          whereClause = { ...whereClause, archive_status };
        }
        if (visiblity_status) {
          whereClause = { ...whereClause, visiblity_status };
        }
        if (billing_status) {
          whereClause = { ...whereClause, billing_status };
        }

        opArgs = {
          limit,
          offset,
          client_id,
          where: whereClause,
          order,
        };
      }
      const { projects, count } = await getFilteredProjects(opArgs);
      return { projects, count };
    },
    getProjectMatrixById: async (_, { id }) => {
      const res = await getProjectMatrixById(id);
      return res;
    },
    getProjectMemberByProjectId: async (parent, args, ctx, info) => {
      const { id } = args;
      const body = { id, workspace_id: ctx.user.current_workspace || ctx.user.WorkspaceMember[0].workspace_id };
      const { projectMembers } = await getProjectMemberByProjectId(body);
      return projectMembers;
    },
    getProjectMemberGroupByProjectId: async (parent, args, ctx, info) => {
      const { id } = args;
      const body = { id, workspace_id: ctx.user.current_workspace || ctx.user.WorkspaceMember[0].workspace_id };
      const { projectMemberGroup } = await getProjectMemberGroupByProjectId(body);
      return projectMemberGroup;
    },
  },
};
