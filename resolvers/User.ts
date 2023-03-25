import { getUser, updateUser, getUsersExceptWorkspaceMember } from '../../controllers/user';
const s3 = require('../../config/s3config');
export const resolvers = {
  Mutation: {
    updateUser: async (
      _,
      { input: { id, current_workspace, first_name, last_name, user_logo, oldPassword, password, is_confirm } },
      ctx
    ) => {
      const ctx_user_password = ctx.user.password;
      const isUserUpdated = await updateUser(id, {
        current_workspace,
        first_name,
        last_name,
        user_logo,
        ctx_user_password,
        oldPassword,
        password,
        is_confirm,
      });
      return { isUserUpdated };
    },

    getUserPicUploadLink: async (_, { input: { fileName, fileType } }) => {
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
    getUser: async (_, { id }) => {
      const res = await getUser(id);
      return res;
    },
    getUsersExceptWorkspaceMember: async (_, { ids }) => {
      const res = await getUsersExceptWorkspaceMember(ids);
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
