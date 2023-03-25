import {
  addWorkSpace,
  updateWorkSpace,
  workSpaceById,
  workSpaceByOwnerId,
  addWorkspaceMember,
  updateWorkspaceMember,
  removeMember,
  WorkSpaceMemberInvitation,
  getWorkSpaceMember,
  getAllWorkspaceMember,
} from '../../controllers/workspace';
const s3 = require('../../config/s3config');
import { Op } from 'sequelize';
import sequelize from '../../loaders/sequelize';
export const resolvers = {
  Mutation: {
    updateWorkSpace: async (
      _,
      {
        input: {
          id,
          owner_id,
          workspace_name,
          company_logo,
          timetracker_status,
          billing_status,
          visibility_status,
          bill_rate,
          bill_rate_view_status,
          currency,
          group_project_label,
          create_project_status,
          create_client_status,
          create_task_status,
          task_filter,
          create_tag_status,
          time_format,
          favorite_status,
        },
      },
      ctx
    ) => {
      const body = {
        id,
        owner_id,
        workspace_name,
        company_logo,
        timetracker_status,
        billing_status,
        visibility_status,
        bill_rate,
        bill_rate_view_status,
        currency,
        group_project_label,
        create_project_status,
        create_client_status,
        create_task_status,
        task_filter,
        create_tag_status,
        time_format,
        favorite_status,
        user_id: ctx.user.id || 1,
      };
      const isUpdated = await updateWorkSpace(body);
      return { isUpdated };
    },

    addWorkSpace: async (
      _,
      {
        input: {
          owner_id,
          workspace_name,
          company_logo,
          timetracker_status,
          billing_status,
          visibility_status,
          bill_rate,
          bill_rate_view_status,
          currency,
          group_project_label,
          create_project_status,
          create_client_status,
          create_task_status,
          task_filter,
          create_tag_status,
          time_format,
          favorite_status,
        },
      },
      ctx
    ) => {
      const res = await addWorkSpace({
        owner_id,
        workspace_name,
        company_logo,
        timetracker_status,
        billing_status,
        visibility_status,
        bill_rate,
        bill_rate_view_status,
        currency,
        group_project_label,
        create_project_status,
        create_client_status,
        create_task_status,
        task_filter,
        create_tag_status,
        time_format,
        favorite_status,
        created_by: ctx.user.id || 1,
        updated_by: ctx.user.id || 1,
      });
      return res;
    },

    //  Resolver For Workspace Member

    addWorkSpaceMember: async (_, { input: { workspace_id, user_id, status } }, ctx) => {
      const res: any = await addWorkspaceMember({
        workspace_id,
        user_id,
        status,
        created_by: ctx.user.id || 1,
        updated_by: ctx.user.id || 1,
      });

      return res.workspace;
    },

    updateWorkSpaceMember: async (_, { input: { id, workspace_id, user_id, email, status, active_status } }) => {
      const res = await updateWorkspaceMember({ id, workspace_id, user_id, email, status, active_status });
      return res.workspace;
    },
    removeMember: async (_, { id }) => {
      const isRemoved = await removeMember({ id });
      return { isRemoved };
    },
    WorkSpaceMemberInvitation: async (_, { input: { workspace_id, users } }) => {
      const res = await WorkSpaceMemberInvitation(workspace_id, users);
      return res;
    },

    getWorkSpacePicUploadLink: async (_, { input: { fileName, fileType } }) => {
      const S3_BUCKET = process.env.BUCKET_NAME;

      const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 500,
        ContentType: fileType,
        ACL: 'public-read',
      };
      const data = await getSignedUrl(s3Params, fileName, S3_BUCKET);
      return data;
    },
  },
  Query: {
    workSpaceByOwnerId: async (_, { owner_id }) => {
      const res = await workSpaceByOwnerId(owner_id);
      return res;
    },
    workSpaceById: async (_, { id }) => {
      const res = await workSpaceById(id);
      return res;
    },
    getWorkSpaceMember: async (parent, args, ctx, info) => {
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
          where: { query: searchQuery, active_status, status, workspace_id, limit, offset },
        } = args;
        let whereClause = {};
        if (searchQuery) {
          whereClause = {
            [Op.or]: [
              sequelize.Sequelize.where(
                sequelize.Sequelize.fn('LOWER', sequelize.Sequelize.col('WorkspaceMember.email')),
                {
                  [Op.like]: `%${searchQuery.toLowerCase()}%`,
                }
              ),
            ],
          };
        }
        if (workspace_id) {
          whereClause = { ...whereClause, workspace_id };
        }
        if (active_status === true || active_status === false) {
          whereClause = { ...whereClause, active_status };
        }
        if (status === 'Accepted' || status === 'Pending') {
          whereClause = { ...whereClause, status };
        }

        opArgs = {
          limit,
          offset,
          where: whereClause,
          order,
        };
      }

      const res = await getWorkSpaceMember(opArgs);
      return res;
    },
    getAllWorkspaceMember: async (_, { workspace_id }) => {
      const res = await getAllWorkspaceMember({ workspace_id });
      return res;
    },
  },
};

const getSignedUrl = function (s3Params, fileName, S3_BUCKET) {
  return new Promise(function (resolve, reject) {
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        reject(err);
      }
      // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
      const res = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
      };
      resolve(res);
    });
  });
};
